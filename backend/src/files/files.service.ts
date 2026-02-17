import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as sharp from 'sharp';

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

@Injectable()
export class FilesService {
  private publicPath: string;
  private imagesPath: string;
  private documentsPath: string;
  private thumbnailsPath: string;

  constructor(private configService: ConfigService) {
    const frontendPath = this.configService.get<string>('paths.frontend');
    this.publicPath = path.join(process.cwd(), frontendPath);
    this.imagesPath = path.join(this.publicPath, 'images');
    this.documentsPath = path.join(this.publicPath, 'documents');
    this.thumbnailsPath = path.join(this.imagesPath, 'thumbnails');
  }

  async ensureDirectories() {
    await fs.mkdir(this.thumbnailsPath, { recursive: true });
    await fs.mkdir(this.documentsPath, { recursive: true });
  }

  async listImages(category?: string): Promise<ImageMetadata[]> {
    const images: ImageMetadata[] = [];
    const baseDir = category ? path.join(this.imagesPath, category) : this.imagesPath;

    try {
      await this.scanImagesRecursively(baseDir, images, '');
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error;
      }
    }

    return images;
  }

  private async scanImagesRecursively(
    dir: string,
    images: ImageMetadata[],
    relativePath: string,
  ) {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relPath = relativePath ? `${relativePath}/${entry.name}` : entry.name;

      if (entry.isDirectory() && entry.name !== 'thumbnails') {
        await this.scanImagesRecursively(fullPath, images, relPath);
      } else if (entry.isFile() && this.isImageFile(entry.name)) {
        const stats = await fs.stat(fullPath);
        const category = relativePath.split('/')[0] || 'root';

        images.push({
          path: `/images/${relPath}`,
          name: entry.name,
          size: stats.size,
          category,
          thumbnail: `/images/thumbnails/${relPath.replace(/\//g, '_')}`,
        });
      }
    }
  }

  private isImageFile(filename: string): boolean {
    const ext = path.extname(filename).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
  }

  async uploadImage(
    file: Express.Multer.File,
    category: string,
  ): Promise<ImageMetadata> {
    await this.ensureDirectories();

    const categoryPath = path.join(this.imagesPath, category);
    await fs.mkdir(categoryPath, { recursive: true });

    const finalPath = path.join(categoryPath, file.filename);

    // Move file to final location if not already there
    if (file.path !== finalPath) {
      await fs.rename(file.path, finalPath);
    }

    // Generate thumbnail
    const thumbnailName = `${category}_${file.filename}`;
    const thumbnailPath = path.join(this.thumbnailsPath, thumbnailName);

    try {
      await sharp(finalPath)
        .resize(200, 200, { fit: 'cover' })
        .toFile(thumbnailPath);
    } catch (error) {
      console.error('Error generating thumbnail:', error);
    }

    const stats = await fs.stat(finalPath);

    return {
      path: `/images/${category}/${file.filename}`,
      name: file.filename,
      size: stats.size,
      category,
      thumbnail: `/images/thumbnails/${thumbnailName}`,
    };
  }

  async deleteImage(imagePath: string): Promise<void> {
    // imagePath is like /images/category/filename.jpg
    const relativePath = imagePath.replace(/^\/images\//, '');
    const fullPath = path.join(this.imagesPath, relativePath);

    try {
      await fs.access(fullPath);
    } catch {
      throw new NotFoundException(`Image not found: ${imagePath}`);
    }

    await fs.unlink(fullPath);

    // Try to delete thumbnail too
    const thumbnailName = relativePath.replace(/\//g, '_');
    const thumbnailPath = path.join(this.thumbnailsPath, thumbnailName);
    try {
      await fs.unlink(thumbnailPath);
    } catch {
      // Thumbnail might not exist
    }
  }

  async listDocuments(): Promise<DocumentMetadata[]> {
    const documents: DocumentMetadata[] = [];

    try {
      const entries = await fs.readdir(this.documentsPath, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isFile() && entry.name.endsWith('.pdf')) {
          const fullPath = path.join(this.documentsPath, entry.name);
          const stats = await fs.stat(fullPath);

          documents.push({
            path: `/documents/${entry.name}`,
            name: entry.name,
            size: stats.size,
          });
        }
      }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error;
      }
    }

    return documents;
  }

  async uploadDocument(file: Express.Multer.File): Promise<DocumentMetadata> {
    await this.ensureDirectories();

    const finalPath = path.join(this.documentsPath, file.filename);

    // Move file to final location if not already there
    if (file.path !== finalPath) {
      await fs.rename(file.path, finalPath);
    }

    const stats = await fs.stat(finalPath);

    return {
      path: `/documents/${file.filename}`,
      name: file.filename,
      size: stats.size,
    };
  }

  async deleteDocument(name: string): Promise<void> {
    const fullPath = path.join(this.documentsPath, name);

    try {
      await fs.access(fullPath);
    } catch {
      throw new NotFoundException(`Document not found: ${name}`);
    }

    await fs.unlink(fullPath);
  }

  async getImageCategories(): Promise<string[]> {
    const categories: string[] = [];

    try {
      const entries = await fs.readdir(this.imagesPath, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isDirectory() && entry.name !== 'thumbnails') {
          categories.push(entry.name);
        }
      }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error;
      }
    }

    return categories;
  }
}
