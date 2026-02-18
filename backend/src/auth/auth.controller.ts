import {
  Controller,
  Post,
  Get,
  Body,
  Res,
  Req,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.login(loginDto);

    response.cookie('token', result.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    return { success: true, message: 'Login successful' };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    return { success: true, message: 'Logout successful' };
  }

  @Get('verify')
  @UseGuards(JwtAuthGuard)
  async verify(@Req() request: Request) {
    const user = request.user as { username: string };
    return { valid: true, username: user.username };
  }
}
