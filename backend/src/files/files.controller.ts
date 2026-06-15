import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  imageFileFilter,
  documentFileFilter,
  audioFileFilter,
  uploadStorage,
} from './multer.config';

@Controller('api/files')
@UseGuards(JwtAuthGuard)
export class FilesController {
  constructor(private filesService: FilesService) {}

  @Get('images')
  async listImages(@Query('category') category?: string) {
    const images = await this.filesService.listImages(category);
    return { images };
  }

  @Get('images/categories')
  async getImageCategories() {
    const categories = await this.filesService.getImageCategories();
    return { categories };
  }

  @Post('images')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: uploadStorage(),
      fileFilter: imageFileFilter,
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    }),
  )
  async uploadImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Query('category') category: string,
  ) {
    if (!category) {
      throw new BadRequestException('Category is required');
    }

    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    const results = await Promise.all(
      files.map((file) => this.filesService.uploadImage(file, category)),
    );

    return { images: results };
  }

  @Post('images/single')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: uploadStorage(),
      fileFilter: imageFileFilter,
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    }),
  )
  async uploadSingleImage(
    @UploadedFile() file: Express.Multer.File,
    @Query('category') category: string,
  ) {
    if (!category) {
      throw new BadRequestException('Category is required');
    }

    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const result = await this.filesService.uploadImage(file, category);
    return { image: result };
  }

  @Delete('images')
  async deleteImage(@Query('path') path: string) {
    if (!path) {
      throw new BadRequestException('path query parameter is required');
    }
    await this.filesService.deleteImage(path);
    return { success: true, message: 'Image deleted' };
  }

  @Get('documents')
  async listDocuments() {
    const documents = await this.filesService.listDocuments();
    return { documents };
  }

  @Post('documents')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: uploadStorage(),
      fileFilter: documentFileFilter,
      limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
    }),
  )
  async uploadDocument(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const result = await this.filesService.uploadDocument(file);
    return { document: result };
  }

  @Delete('documents/:name')
  async deleteDocument(@Param('name') name: string) {
    await this.filesService.deleteDocument(name);
    return { success: true, message: 'Document deleted' };
  }

  @Post('audio')
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      storage: uploadStorage(),
      fileFilter: audioFileFilter,
      limits: { fileSize: 30 * 1024 * 1024 }, // 30MB
    }),
  )
  async uploadAudio(
    @UploadedFiles() files: Express.Multer.File[],
    @Query('category') category: string,
  ) {
    if (!category) {
      throw new BadRequestException('Category is required');
    }

    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    const results = await Promise.all(
      files.map((file) => this.filesService.uploadAudio(file, category)),
    );

    return { audio: results };
  }

  @Delete('audio')
  async deleteAudio(@Query('path') path: string) {
    if (!path) {
      throw new BadRequestException('path query parameter is required');
    }
    await this.filesService.deleteAudio(path);
    return { success: true, message: 'Audio deleted' };
  }
}
