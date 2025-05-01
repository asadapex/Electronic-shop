import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const ctg = await this.prisma.category.findFirst({
        where: { type: createCategoryDto.type, name: createCategoryDto.name },
      });
      if (ctg) {
        throw new BadRequestException('Category already exists');
      }
      const newCtg = await this.prisma.category.create({
        data: createCategoryDto,
      });
      return newCtg;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException({
        message: 'Something went wrong',
      });
    }
  }

  async findAll(query: any) {
    try {
      const {
        createdAt = 'asc',
        name,
        sort = 'asc',
        page = 1,
        limit = 10,
      } = query;

      const where: any = {};

      if (name) {
        where.OR = [{ name: { contains: name, mode: 'insensitive' } }];
      }

      const orderBy: any = [];

      if (createdAt) {
        orderBy.push({ createdAt });
      }

      if (sort) {
        orderBy.push({ name: sort });
      }

      const skip = (page - 1) * limit;
      const take = Number(limit);

      const all = await this.prisma.category.findMany({
        where,
        orderBy,
        skip,
        take,
      });

      const total = await this.prisma.category.count({ where });

      return {
        data: all,
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException({
        message: 'Something went wrong',
      });
    }
  }

  async findOne(id: number) {
    try {
      const one = await this.prisma.category.findUnique({ where: { id } });
      if (!one) {
        throw new NotFoundException('Category not found');
      }
      return one;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.log(error);
      throw new InternalServerErrorException({
        message: 'Something went wrong',
      });
    }
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      const updated = await this.prisma.category.update({
        where: { id },
        data: updateCategoryDto,
      });
      if (!updated) {
        throw new NotFoundException('Category not found');
      }
      return updated;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.log(error);
      throw new InternalServerErrorException({
        message: 'Something went wrong',
      });
    }
  }

  async remove(id: number) {
    try {
      const deleted = await this.prisma.category.delete({ where: { id } });
      if (!deleted) {
        throw new NotFoundException('Category not found');
      }
      return deleted;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.log(error);
      throw new InternalServerErrorException({
        message: 'Something went wrong',
      });
    }
  }
}
