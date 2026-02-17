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
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { FilesService } from './files.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { imageFileFilter, documentFileFilter } from './multer.config';
import { ConfigService } from '@nestjs/config';

@Controller('api/files')
@UseGuards(JwtAuthGuard)
export class FilesController {
  private uploadPath: string;

  constructor(
    private filesService: FilesService,
    private configService: ConfigService,
  ) {
    const frontendPath = this.configService.get<string>('paths.frontend');
    this.uploadPath = join(process.cwd(), frontendPath);
  }

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
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          cb(null, join(process.cwd(), '../frontend/public/images/temp'));
        },
        filename: (_req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `image-${uniqueSuffix}${ext}`);
        },
      }),
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
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          cb(null, join(process.cwd(), '../frontend/public/images/temp'));
        },
        filename: (_req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `image-${uniqueSuffix}${ext}`);
        },
      }),
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

  @Delete('images/*')
  async deleteImage(@Param() params: { 0: string }) {
    const imagePath = '/' + params[0];
    await this.filesService.deleteImage(imagePath);
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
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          cb(null, join(process.cwd(), '../frontend/public/documents'));
        },
        filename: (_req, file, cb) => {
          const sanitized = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
          cb(null, sanitized);
        },
      }),
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
}
