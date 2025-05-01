import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCommentDto, req: Request) {
    try {
      const prd = await this.prisma.product.findUnique({
        where: { id: dto.productId },
      });
      if (!prd) {
        throw new NotFoundException({ message: 'Product not found' });
      }
      const newComment = await this.prisma.comments.create({
        data: {
          userId: req['user-id'],
          productId: dto.productId,
          text: dto.text,
          star: dto.star,
        },
      });
      return newComment;
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

  async findAll() {
    try {
      const all = await this.prisma.comments.findMany({
        include: { user: true, product: true },
      });
      return all;
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

  async findOne(id: number) {
    try {
      const all = await this.prisma.comments.findUnique({
        where: { id },
        include: { user: true, product: true },
      });
      return all;
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

  async update(id: number, updateCommentDto: UpdateCommentDto, req: Request) {
    try {
      if (req['user-role'] == 'ADMIN') {
        const updated = await this.prisma.comments.update({
          where: { id },
          data: updateCommentDto,
        });
        if (!updated) {
          throw new NotFoundException({ message: 'Comment not found' });
        }
        return updated;
      }
      const updated = await this.prisma.comments.update({
        where: { id, userId: req['user-id'] },
        data: updateCommentDto,
      });
      if (!updated) {
        throw new NotFoundException({ message: 'Comment not found' });
      }
      return updated;
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

  async remove(id: number, req: Request) {
    try {
      if (req['user-role'] == 'ADMIN') {
        const deleted = await this.prisma.comments.delete({ where: { id } });
        if (!deleted) {
          throw new NotFoundException({ message: 'Comment not found' });
        }
        return deleted;
      }
      const deleted = await this.prisma.comments.delete({
        where: { id, userId: req['user-id'] },
      });
      if (!deleted) {
        throw new NotFoundException({ message: 'Comment not found' });
      }
      return deleted;
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
}
