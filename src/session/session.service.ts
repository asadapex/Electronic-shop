import { Injectable, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SessionService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(req: Request) {
    const all = await this.prisma.sessions.findMany({
      where: { userId: req['user-id'], ip: req.ip },
    });

    return all;
  }

  async remove(id: number, req: Request) {
    const session = await this.prisma.sessions.findFirst({
      where: { id, userId: req['user-id'] },
    });

    if (!session) {
      throw new NotFoundException({ message: 'Session not found' });
    }
    const deleted = await this.prisma.sessions.delete({ where: { id } });

    return deleted;
  }
}
