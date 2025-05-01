import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto, req: Request) {
    try {
      const newPrd = await this.prisma.products.create({
        data: { ...createProductDto, userId: req['user-id'] },
        include: {
          user: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
            },
          },
          category: true,
        },
      });

      return newPrd;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException({ message: 'Server error' });
    }
  }

  findAll() {
    return `This action returns all product`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
