import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ContentService, ContentType } from './content.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/content')
@UseGuards(JwtAuthGuard)
export class ContentController {
  constructor(private contentService: ContentService) {}

  @Get('types')
  getContentTypes() {
    return { types: this.contentService.getValidContentTypes() };
  }

  @Get(':type')
  async getContent(@Param('type') type: ContentType) {
    return this.contentService.getContent(type);
  }

  @Put(':type')
  async updateContent(@Param('type') type: ContentType, @Body() data: unknown) {
    return this.contentService.updateContent(type, data);
  }

  @Post(':type/item')
  async addItem(@Param('type') type: ContentType, @Body() item: unknown) {
    return this.contentService.addItem(type, item);
  }

  @Put(':type/item/:index')
  async updateItem(
    @Param('type') type: ContentType,
    @Param('index', ParseIntPipe) index: number,
    @Body() item: unknown,
  ) {
    return this.contentService.updateItem(type, index, item);
  }

  @Delete(':type/item/:index')
  async deleteItem(
    @Param('type') type: ContentType,
    @Param('index', ParseIntPipe) index: number,
  ) {
    return this.contentService.deleteItem(type, index);
  }
}
