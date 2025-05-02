import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async findMyOrder(req: Request) {
    try {
      const orders = await this.prisma.order.findMany({
        where: { userId: req['user-id'] },
        include: {
          product: true,
          color: true,
          user: { select: { id: true, firstname: true, email: true } },
        },
      });
      return orders;
    } catch (error) {
      if (error != InternalServerErrorException) {
        throw error;
      }
      throw new InternalServerErrorException({
        message: 'Something went wrong',
      });
    }
  }

  async findMyLikes(req: Request) {
    try {
      const likes = await this.prisma.likes.findMany({
        where: { userId: req['user-id'] },
        include: {
          product: true,
          user: { select: { id: true, firstname: true, email: true } },
        },
      });
      return likes;
    } catch (error) {
      if (error != InternalServerErrorException) {
        throw error;
      }
      throw new InternalServerErrorException({
        message: 'Something went wrong',
      });
    }
  }

  async findMyLastViewed(req: Request) {
    try {
      const viewed = await this.prisma.views.findMany({
        where: { userId: req['user-id'] },
        include: {
          product: true,
          user: { select: { id: true, firstname: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
      return viewed;
    } catch (error) {
      if (error != InternalServerErrorException) {
        throw error;
      }
      throw new InternalServerErrorException({
        message: 'Something went wrong',
      });
    }
  }

  async findMyPosts(req: Request) {
    try {
      const posts = await this.prisma.product.findMany({
        where: { userId: req['user-id'] },
        include: {
          user: { select: { id: true, firstname: true, email: true } },
        },
      });
      return posts;
    } catch (error) {
      if (error != InternalServerErrorException) {
        throw error;
      }
      throw new InternalServerErrorException({
        message: 'Something went wrong',
      });
    }
  }

  async findMyChats(req: Request) {
    try {
      const chats = await this.prisma.chat.findMany({
        where: { OR: [{ fromId: req['user-id'] }, { toId: req['user-id'] }] },
        include: {
          fromUser: { select: { id: true, firstname: true, email: true } },
          toUser: { select: { id: true, firstname: true, email: true } },
        },
      });
      return chats;
    } catch (error) {
      if (error != InternalServerErrorException) {
        throw error;
      }
      throw new InternalServerErrorException({
        message: 'Something went wrong',
      });
    }
  }
}
