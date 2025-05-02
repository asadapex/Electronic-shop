import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthguardGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const token = req.headers.authorization?.split(' ')?.[1];

    if (!token) {
      throw new UnauthorizedException({ message: 'Token not provided' });
    }

    try {
      const data = await this.jwt.verifyAsync(token);
      req['user-id'] = data.id;
      req['user-role'] = data.role;

      const ip = (req.headers['x-forwarded-for'] as string) || req.ip;

      const session = await this.prisma.sessions.findFirst({
        where: { userId: data.id, ip },
      });

      if (!session) {
        throw new UnauthorizedException({
          message: 'Please log in again to your account',
        });
      }

      return true;
    } catch (error) {
      throw new UnauthorizedException({ message: 'Wrong credentials' });
    }
  }
}
