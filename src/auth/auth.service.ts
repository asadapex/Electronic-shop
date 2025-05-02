import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserStatus } from '@prisma/client';
import { MailerService } from 'src/mailer/mailer.service';
import { totp } from 'otplib';
import * as bcrypt from 'bcrypt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { VerifyAuthDto } from './dto/verify-auth.dto';
import { ResendOtpAuthDto } from './dto/resendotp-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ResetPasswordAuthDto } from './dto/resetpassword-auth.dto';

totp.options = {
  digits: 5,
  step: 120,
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailerService,
    private readonly jwt: JwtService,
  ) {}

  generateOtpHtml(code: string): string {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <h2 style="color: #4CAF50; text-align: center;">🔐 Apex Electronics</h2>
      <p style="font-size: 16px;">Assalomu alaykum,</p>
      <p style="font-size: 16px;">Sizning bir martalik parolingiz (OTP):</p>
      <div style="font-size: 30px; font-weight: bold; color: #333; text-align: center; margin: 20px 0;">
        ${code}
      </div>
      <p style="font-size: 14px; color: #555;">Kod 2 daqiqa davomida amal qiladi. Kodni hech kim bilan bo'lishmang.</p>
      <hr />
      <p style="font-size: 12px; color: #999;">Agar bu xabar siz kutmagan bo‘lsangiz, iltimos, e'tiborsiz qoldiring.</p>
    </div>
    `;
  }

  async findUser(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user;
  }

  async register(dto: CreateAuthDto) {
    try {
      const user = await this.findUser(dto.email);
      if (user) {
        throw new BadRequestException({ message: 'User already exists' });
      }

      const otp = totp.generate(dto.email + 'apex');
      await this.mailService.sendMail(
        dto.email,
        '🔐 Your OTP Code',
        this.generateOtpHtml(`${otp}`),
      );

      const hash = bcrypt.hashSync(dto.password, 10);
      await this.prisma.user.create({
        data: { ...dto, status: UserStatus.PENDING, password: hash },
      });
      return { message: 'Verification code sent to your email' };
    } catch (error) {
      if (error != InternalServerErrorException) {
        throw error;
      }
      console.log(error);
      throw new InternalServerErrorException({
        message: 'Something went wrong',
      });
    }
  }

  async verify(dto: VerifyAuthDto) {
    try {
      const user = await this.findUser(dto.email);
      if (!user) {
        throw new NotFoundException({ message: 'User not found' });
      }

      const match = totp.verify({ token: dto.otp, secret: dto.email + 'apex' });
      if (!match) {
        throw new BadRequestException({ message: 'Wrong code' });
      }

      await this.prisma.user.update({
        where: { id: user.id },
        data: { status: UserStatus.ACTIVE },
      });

      return { mesage: 'Verified' };
    } catch (error) {
      console.log(error);
      if (error != InternalServerErrorException) {
        throw error;
      }
      throw new InternalServerErrorException({
        message: 'Something went wrong please try again',
      });
    }
  }

  async resendOtp(dto: ResendOtpAuthDto) {
    try {
      const user = await this.findUser(dto.email);
      if (!user) {
        throw new NotFoundException({ message: 'User not found' });
      }

      const otp = totp.generate(dto.email + 'apex');
      await this.mailService.sendMail(
        dto.email,
        '🔐 Your OTP Code',
        this.generateOtpHtml(`${otp}`),
      );

      return { message: 'Verification code sent to your email' };
    } catch (error) {
      if (error != InternalServerErrorException) {
        throw error;
      }
      console.log(error);
      throw new InternalServerErrorException({
        message: 'Something went wrong',
      });
    }
  }

  async login(dto: LoginAuthDto, req: Request) {
    try {
      const user = await this.findUser(dto.email);
      if (!user) {
        throw new NotFoundException({ message: 'User not found' });
      }

      const match = bcrypt.compareSync(dto.password, user.password);
      if (!match) {
        throw new BadRequestException({ message: 'Wrong password' });
      }

      if (user.status == 'PENDING') {
        throw new BadRequestException({
          message: "You haven't verified yet please verify",
        });
      }

      const token = this.jwt.sign({ id: user.id, role: user.role });

      return { token };
    } catch (error) {
      if (error != InternalServerErrorException) {
        throw error;
      }
      console.log(error);
      throw new InternalServerErrorException({
        message: 'Something went wrong',
      });
    }
  }

  async myInfo(req: Request) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: req['user-id'] },
        select: {
          photo: true,
          firstname: true,
          lastname: true,
          email: true,
          role: true,
          region: {
            select: { name: true },
          },
        },
      });
      return user;
    } catch (error) {
      if (error != InternalServerErrorException) {
        throw error;
      }
      console.log(error);
      throw new InternalServerErrorException({
        message: 'Something went wrong',
      });
    }
  }

  async resetPassword(dto: ResetPasswordAuthDto) {
    try {
      const user = await this.findUser(dto.email);
      if (!user) {
        throw new NotFoundException({ message: 'User not found' });
      }

      const match = totp.verify({ token: dto.otp, secret: dto.email + 'apex' });
      if (!match) {
        throw new BadRequestException({ message: 'Wrong code' });
      }

      const hash = bcrypt.hashSync(dto.newPassword, 10);

      await this.prisma.user.update({
        where: { id: user.id },
        data: { password: hash },
      });

      return { mesage: 'Password changed' };
    } catch (error) {
      if (error != InternalServerErrorException) {
        throw error;
      }
      console.log(error);
      throw new InternalServerErrorException({
        message: 'Something went wrong please try again',
      });
    }
  }
}
