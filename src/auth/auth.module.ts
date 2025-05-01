import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MailerService } from 'src/mailer/mailer.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'apex1',
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, MailerService],
})
export class AuthModule {}
