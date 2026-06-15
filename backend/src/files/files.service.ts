import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as sharp from 'sharp';
import { SupabaseService } from '../supabase/supabase.service';

export interface ImageMetadata {
  path: string;
  name: string;
  size: number;
  dimensions?: { width: number; height: number };
  thumbnail?: string;
  category: string;
}

export interface DocumentMetadata {
  path: string;
  name: string;
  size: number;
}

export interface AudioMetadata {
  path: string;
  name: string;
  title: string;
  size: number;
}

const THUMBNAILS_PREFIX = 'thumbnails';

@Injectable()
export class FilesService {
  private imagesBucket: string;
  private audioBucket: string;
  private documentsBucket: string;

  constructor(
    private configService: ConfigService,
    private supabaseService: SupabaseService,
  ) {
    this.imagesBucket = this.configService.get<string>('supabase.buckets.images');
    this.audioBucket = this.configService.get<string>('supabase.buckets.audio');
    this.documentsBucket = this.configService.get<string>('supabase.buckets.documents');
  }

  private get storage() {
    return this.supabaseService.getClient().storage;
  }

  private generateFilename(file: Express.Multer.File): string {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || '';
    return `${file.fieldname}-${uniqueSuffix}${ext}`;
  }

  private publicUrl(bucket: string, key: string): string {
    return this.storage.from(bucket).getPublicUrl(key).data.publicUrl;
  }

  /**
   * Accepts either a full Supabase public URL or a stored storage key and
   * returns the key relative to the given bucket. Returns null when the value
   * does not belong to this bucket (e.g. a legacy static path like /images/..).
   */
  private keyFromPath(bucket: string, value: string): string | null {
    const marker = `/object/public/${bucket}/`;
    const idx = value.indexOf(marker);
    if (idx !== -1) {
      return decodeURIComponent(value.slice(idx + marker.length));
    }
    // Already a bare key (no protocol, no leading slash)
    if (!value.startsWith('http') && !value.startsWith('/')) {
      return value;
    }
    return null;
  }

  private isImageFile(filename: string): boolean {
    const ext = path.extname(filename).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
  }

  async listImages(category?: string): Promise<ImageMetadata[]> {
    const images: ImageMetadata[] = [];

    let folders: string[];
    if (category) {
      folders = [category];
    } else {
      const { data: rootEntries, error } = await this.storage
        .from(this.imagesBucket)
        .list('', { limit: 1000 });
      if (error) {
        throw new BadRequestException(`Failed to list images: ${error.message}`);
      }
      folders = (rootEntries || [])
        .filter((e) => e.id === null && e.name !== THUMBNAILS_PREFIX)
        .map((e) => e.name);
    }

    for (const folder of folders) {
      const { data: files, error } = await this.storage
        .from(this.imagesBucket)
        .list(folder, { limit: 1000 });
      if (error) {
        continue;
      }

      for (const file of files || []) {
        if (file.id === null || !this.isImageFile(file.name)) {
          continue;
        }
        const key = `${folder}/${file.name}`;
        images.push({
          path: this.publicUrl(this.imagesBucket, key),
          name: file.name,
          size: (file.metadata?.size as number) || 0,
          category: folder,
          thumbnail: this.publicUrl(
            this.imagesBucket,
            `${THUMBNAILS_PREFIX}/${folder}_${file.name}`,
          ),
        });
      }
    }

    return images;
  }

  async getImageCategories(): Promise<string[]> {
    const { data: rootEntries, error } = await this.storage
      .from(this.imagesBucket)
      .list('', { limit: 1000 });
    if (error) {
      throw new BadRequestException(`Failed to list categories: ${error.message}`);
    }
    return (rootEntries || [])
      .filter((e) => e.id === null && e.name !== THUMBNAILS_PREFIX)
      .map((e) => e.name);
  }

  async uploadImage(
    file: Express.Multer.File,
    category: string,
  ): Promise<ImageMetadata> {
    const filename = this.generateFilename(file);
    const key = `${category}/${filename}`;

    const { error } = await this.storage
      .from(this.imagesBucket)
      .upload(key, file.buffer, { contentType: file.mimetype, upsert: false });
    if (error) {
      throw new BadRequestException(`Failed to upload image: ${error.message}`);
    }

    // Generate and upload a thumbnail (best effort)
    const thumbnailKey = `${THUMBNAILS_PREFIX}/${category}_${filename}`;
    try {
      const thumbBuffer = await sharp(file.buffer)
        .resize(200, 200, { fit: 'cover' })
        .toBuffer();
      await this.storage
        .from(this.imagesBucket)
        .upload(thumbnailKey, thumbBuffer, {
          contentType: file.mimetype,
          upsert: true,
        });
    } catch (err) {
      console.error('Error generating thumbnail:', err);
    }

    return {
      path: this.publicUrl(this.imagesBucket, key),
      name: filename,
      size: file.size,
      category,
      thumbnail: this.publicUrl(this.imagesBucket, thumbnailKey),
    };
  }

  async deleteImage(imagePath: string): Promise<void> {
    const key = this.keyFromPath(this.imagesBucket, imagePath);
    if (!key) {
      throw new NotFoundException(`Image not managed by storage: ${imagePath}`);
    }

    const { error } = await this.storage.from(this.imagesBucket).remove([key]);
    if (error) {
      throw new BadRequestException(`Failed to delete image: ${error.message}`);
    }

    // Best-effort thumbnail removal: thumbnails/<category>_<filename>
    const parts = key.split('/');
    if (parts.length >= 2) {
      const category = parts[0];
      const filename = parts.slice(1).join('/');
      const thumbKey = `${THUMBNAILS_PREFIX}/${category}_${filename}`;
      await this.storage.from(this.imagesBucket).remove([thumbKey]);
    }
  }

  async listDocuments(): Promise<DocumentMetadata[]> {
    const { data: files, error } = await this.storage
      .from(this.documentsBucket)
      .list('', { limit: 1000 });
    if (error) {
      throw new BadRequestException(`Failed to list documents: ${error.message}`);
    }

    return (files || [])
      .filter((f) => f.id !== null && f.name.toLowerCase().endsWith('.pdf'))
      .map((f) => ({
        path: this.publicUrl(this.documentsBucket, f.name),
        name: f.name,
        size: (f.metadata?.size as number) || 0,
      }));
  }

  async uploadDocument(file: Express.Multer.File): Promise<DocumentMetadata> {
    const name = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');

    const { error } = await this.storage
      .from(this.documentsBucket)
      .upload(name, file.buffer, { contentType: file.mimetype, upsert: true });
    if (error) {
      throw new BadRequestException(`Failed to upload document: ${error.message}`);
    }

    return {
      path: this.publicUrl(this.documentsBucket, name),
      name,
      size: file.size,
    };
  }

  async deleteDocument(name: string): Promise<void> {
    const { error } = await this.storage.from(this.documentsBucket).remove([name]);
    if (error) {
      throw new BadRequestException(`Failed to delete document: ${error.message}`);
    }
  }

  async uploadAudio(
    file: Express.Multer.File,
    category: string,
  ): Promise<AudioMetadata> {
    const filename = this.generateFilename(file);
    const key = `${category}/${filename}`;

    const { error } = await this.storage
      .from(this.audioBucket)
      .upload(key, file.buffer, { contentType: file.mimetype, upsert: false });
    if (error) {
      throw new BadRequestException(`Failed to upload audio: ${error.message}`);
    }

    return {
      path: this.publicUrl(this.audioBucket, key),
      name: filename,
      title: path.parse(file.originalname).name,
      size: file.size,
    };
  }

  async deleteAudio(audioPath: string): Promise<void> {
    const key = this.keyFromPath(this.audioBucket, audioPath);
    if (!key) {
      throw new NotFoundException(`Audio not managed by storage: ${audioPath}`);
    }

    const { error } = await this.storage.from(this.audioBucket).remove([key]);
    if (error) {
      throw new BadRequestException(`Failed to delete audio: ${error.message}`);
    }
  }
}
