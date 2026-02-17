import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';
import * as path from 'path';

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
  | 'galerie_spectacle';

const CONTENT_FILES: Record<ContentType, string> = {
  concerts: 'concerts.json',
  spectacles: 'spectacles.json',
  discographie: 'discographie.json',
  instruments: 'instruments.json',
  voix_data: 'voix_data.json',
  ateliers_instruments: 'ateliers_instruments.json',
  avis_instruments: 'avis_instruments.json',
  avis_voix: 'avis_voix.json',
  dernier_album: 'dernier_album.json',
  galerie: 'galerie.json',
  galerie_spectacle: 'galerie_spectacle.json',
};

@Injectable()
export class ContentService {
  private dataPath: string;

  constructor(private configService: ConfigService) {
    const frontendPath = this.configService.get<string>('paths.frontend');
    this.dataPath = path.join(process.cwd(), frontendPath, 'data');
  }

  private getFilePath(type: ContentType): string {
    const filename = CONTENT_FILES[type];
    if (!filename) {
      throw new BadRequestException(`Invalid content type: ${type}`);
    }
    return path.join(this.dataPath, filename);
  }

  async getContent(type: ContentType): Promise<unknown> {
    const filePath = this.getFilePath(type);
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        throw new NotFoundException(`Content file not found: ${type}`);
      }
      throw error;
    }
  }

  async updateContent(type: ContentType, data: unknown): Promise<unknown> {
    const filePath = this.getFilePath(type);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
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
    return Object.keys(CONTENT_FILES) as ContentType[];
  }
}
