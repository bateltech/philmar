import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<boolean> {
    const adminUsername = this.configService.get<string>('admin.username');
    const adminPasswordHash = this.configService.get<string>('admin.passwordHash');

    if (loginDto.username !== adminUsername) {
      return false;
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, adminPasswordHash);
    return isPasswordValid;
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    const isValid = await this.validateUser(loginDto);

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { username: loginDto.username, sub: 'admin' };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async verify(token: string): Promise<{ valid: boolean; username?: string }> {
    try {
      const payload = this.jwtService.verify(token);
      return { valid: true, username: payload.username };
    } catch {
      return { valid: false };
    }
  }
}
