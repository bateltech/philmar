import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BackupService } from './backup.service';

/**
 * Sauvegarde de l'admin :
 * - GET  /api/backup          → fichier JSON avec tout le contenu du site + les messages reçus
 * - POST /api/backup/restore  → remet le contenu du site tel qu'il était dans une sauvegarde
 */
@Controller('api/backup')
@UseGuards(JwtAuthGuard)
export class BackupController {
  constructor(private backupService: BackupService) {}

  @Get()
  exportBackup() {
    return this.backupService.exportBackup();
  }

  @Post('restore')
  restoreBackup(@Body() backup: unknown) {
    return this.backupService.restoreContent(backup);
  }
}
