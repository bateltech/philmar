import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

export type ContentType =
  | 'concerts'
  | 'spectacles'
  | 'discographie'
  | 'instruments'
  | 'voix_data'
  | 'ateliers_instruments'
  | 'avis_instruments'
  | 'avis_voix'
  | 'dernier_album'
  | 'galerie'
  | 'galerie_spectacle'
  | 'social_links'
  | 'page_404';

const CONTENT_TYPES: ContentType[] = [
  'concerts',
  'spectacles',
  'discographie',
  'instruments',
  'voix_data',
  'ateliers_instruments',
  'avis_instruments',
  'avis_voix',
  'dernier_album',
  'galerie',
  'galerie_spectacle',
  'social_links',
  'page_404',
];

const CONTENT_TABLE = 'content';

@Injectable()
export class ContentService {
  constructor(private supabaseService: SupabaseService) {}

  private assertValidType(type: ContentType): void {
    if (!CONTENT_TYPES.includes(type)) {
      throw new BadRequestException(`Invalid content type: ${type}`);
    }
  }

  async getContent(type: ContentType): Promise<unknown> {
    this.assertValidType(type);

    const { data, error } = await this.supabaseService
      .getClient()
      .from(CONTENT_TABLE)
      .select('data')
      .eq('type', type)
      .maybeSingle();

    if (error) {
      throw new BadRequestException(`Failed to read content "${type}": ${error.message}`);
    }
    if (!data) {
      throw new NotFoundException(`Content not found: ${type}`);
    }

    return data.data;
  }

  async updateContent(type: ContentType, data: unknown): Promise<unknown> {
    this.assertValidType(type);

    const { error } = await this.supabaseService
      .getClient()
      .from(CONTENT_TABLE)
      .upsert(
        { type, data, updated_at: new Date().toISOString() },
        { onConflict: 'type' },
      );

    if (error) {
      throw new BadRequestException(`Failed to save content "${type}": ${error.message}`);
    }

    return data;
  }

  async addItem(type: ContentType, item: unknown): Promise<unknown[]> {
    const content = await this.getContent(type);
    if (!Array.isArray(content)) {
      throw new BadRequestException(`Content type ${type} is not an array`);
    }
    content.push(item);
    await this.updateContent(type, content);
    return content;
  }

  async updateItem(type: ContentType, index: number, item: unknown): Promise<unknown[]> {
    const content = await this.getContent(type);
    if (!Array.isArray(content)) {
      throw new BadRequestException(`Content type ${type} is not an array`);
    }
    if (index < 0 || index >= content.length) {
      throw new NotFoundException(`Item at index ${index} not found`);
    }
    content[index] = item;
    await this.updateContent(type, content);
    return content;
  }

  async deleteItem(type: ContentType, index: number): Promise<unknown[]> {
    const content = await this.getContent(type);
    if (!Array.isArray(content)) {
      throw new BadRequestException(`Content type ${type} is not an array`);
    }
    if (index < 0 || index >= content.length) {
      throw new NotFoundException(`Item at index ${index} not found`);
    }
    content.splice(index, 1);
    await this.updateContent(type, content);
    return content;
  }

  getValidContentTypes(): ContentType[] {
    return [...CONTENT_TYPES];
  }
}
