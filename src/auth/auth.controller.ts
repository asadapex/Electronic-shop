import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { VerifyAuthDto } from './dto/verify-auth.dto';
import { ResendOtpAuthDto } from './dto/resendotp-auth.dto';
import { AuthguardGuard } from 'src/authguard/authguard.guard';
import { Request } from 'express';
import { ResetPasswordAuthDto } from './dto/resetpassword-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }

  @Post('verify')
  verify(@Body() data: VerifyAuthDto) {
    return this.authService.verify(data);
  }

  @Post('resend-otp')
  resendOtp(@Body() data: ResendOtpAuthDto) {
    return this.authService.resendOtp(data);
  }

  @Post('login')
  login(@Body() data: LoginAuthDto) {
    return this.authService.login(data);
  }

  @Post('reset-password')
  resetPassword(@Body() data: ResetPasswordAuthDto) {
    return this.authService.resetPassword(data);
  }

  @UseGuards(AuthguardGuard)
  @Get('me')
  myInfo(@Req() req: Request) {
    return this.authService.myInfo(req);
  }
}
