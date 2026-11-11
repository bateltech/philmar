import { Module } from '@nestjs/common';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';
import { BackupController } from './backup.controller';
import { BackupService } from './backup.service';

@Module({
  controllers: [ContentController, BackupController],
  providers: [ContentService, BackupService],
  exports: [ContentService],
})
export class ContentModule {}
