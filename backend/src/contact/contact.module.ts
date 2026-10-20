import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';

@Module({
  imports: [ThrottlerModule.forRoot([{ ttl: 60 * 1000, limit: 10 }])],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}
