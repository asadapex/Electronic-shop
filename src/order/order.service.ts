import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto, req: Request) {
    try {
      const prd = await this.prisma.product.findUnique({
        where: { id: createOrderDto.productId },
      });
      if (!prd) {
        throw new NotFoundException({ message: 'Product not found' });
      }

      const color = await this.prisma.color.findUnique({
        where: { id: createOrderDto.color },
      });
      if (!color) {
        throw new NotFoundException({ message: 'Color not found' });
      }

      const newOrder = await this.prisma.order.create({
        data: {
          productId: createOrderDto.productId,
          colorId: createOrderDto.color,
          count: createOrderDto.count,
          userId: Number(req['user-id']),
        },
        include: {
          product: true,
          color: true,
          user: { select: { id: true, firstname: true, email: true } },
        },
      });
      return newOrder;
    } catch (error) {
      if (error != InternalServerErrorException) {
        throw error;
      }
      throw new InternalServerErrorException({
        message: 'Something went wrong',
      });
    }
  }

  async findAll() {
    try {
      const all = await this.prisma.order.findMany({
        include: {
          product: true,
          color: true,
          user: { select: { id: true, firstname: true, email: true } },
        },
      });
      return all;
    } catch (error) {
      if (error != InternalServerErrorException) {
        throw error;
      }
      throw new InternalServerErrorException({
        message: 'Something went wrong',
      });
    }
  }

  async findOne(id: number, req: Request) {
    try {
      if (req['user-role'] == 'ADMIN') {
        const one = await this.prisma.order.findUnique({
          where: { id },
          include: {
            product: true,
            color: true,
            user: { select: { id: true, firstname: true, email: true } },
          },
        });
        if (!one) {
          throw new NotFoundException({ message: 'Order not found' });
        }
        return one;
      }
      const one = await this.prisma.order.findFirst({
        where: { userId: req['user-id'], productId: id },
        include: {
          product: true,
          color: true,
          user: { select: { id: true, firstname: true, email: true } },
        },
      });
      if (!one) {
        throw new ForbiddenException({ message: 'Forbidden' });
      }
      return one;
    } catch (error) {
      if (error != InternalServerErrorException) {
        throw error;
      }
      throw new InternalServerErrorException({
        message: 'Something went wrong',
      });
    }
  }

  async remove(id: number, req: Request) {
    try {
      if (req['user-role'] == 'ADMIN') {
        const exists = await this.prisma.order.findUnique({ where: { id } });
        if (!exists) {
          throw new NotFoundException({ message: 'Order not found' });
        }
        const deleted = await this.prisma.order.delete({ where: { id } });
        if (!deleted) {
          throw new NotFoundException({ message: 'Order not found' });
        }
        return deleted;
      }
      const exists = await this.prisma.order.findUnique({ where: { id } });
      if (!exists) {
        throw new NotFoundException({ message: 'Order not found' });
      }
      const order = await this.prisma.order.findFirst({
        where: { userId: req['user-id'], productId: id },
      });
      if (!order) {
        throw new ForbiddenException({ message: 'Forbidden' });
      }
      const deleted = await this.prisma.order.delete({
        where: { id: order.id },
      });
      if (!deleted) {
        throw new NotFoundException({ message: 'Order not found' });
      }
      return deleted;
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
