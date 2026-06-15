import { memoryStorage } from 'multer';
import { BadRequestException } from '@nestjs/common';

export const imageFileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(new BadRequestException('Only image files are allowed'), false);
  }
};

export const documentFileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  const allowedMimes = ['application/pdf'];
  if (allowedMimes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(new BadRequestException('Only PDF files are allowed'), false);
  }
};

export const audioFileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  const allowedMimes = ['audio/mpeg', 'audio/mp3'];
  if (allowedMimes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(new BadRequestException('Only MP3 files are allowed'), false);
  }
};

/**
 * Files are kept in memory and streamed straight to Supabase Storage, so no
 * disk is ever touched. This is what makes the backend deployable on
 * serverless / ephemeral hosts.
 */
export const uploadStorage = () => memoryStorage();
