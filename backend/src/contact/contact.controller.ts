import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
} from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { IsBoolean } from 'class-validator';
import type { Request } from 'express';
import { ContactService } from './contact.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

class SetReadDto {
  @IsBoolean()
  read: boolean;
}

@Controller('api/contact')
export class ContactController {
  constructor(private contactService: ContactService) {}

  /** Formulaire public : 3 envois max par tranche de 10 minutes et par IP. */
  @Post()
  @HttpCode(200)
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 3, ttl: 10 * 60 * 1000 } })
  async submit(@Body() dto: CreateMessageDto, @Req() req: Request) {
    await this.contactService.submit(dto, req.ip);
    return { success: true };
  }

  @Get('messages')
  @UseGuards(JwtAuthGuard)
  list() {
    return this.contactService.list();
  }

  @Patch('messages/:id')
  @UseGuards(JwtAuthGuard)
  setRead(@Param('id', ParseUUIDPipe) id: string, @Body() dto: SetReadDto) {
    return this.contactService.setRead(id, dto.read);
  }

  @Delete('messages/:id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.contactService.remove(id);
    return { success: true };
  }
}
