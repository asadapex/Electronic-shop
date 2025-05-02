import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto, req: Request) {
    try {
      const category = await this.prisma.category.findUnique({
        where: { id: createProductDto.categoryId },
      });

      if (!category) {
        throw new NotFoundException({ message: 'Category not found' });
      }

      const colors = await this.prisma.color.findMany({
        where: { id: { in: createProductDto.Color } },
      });

      if (colors.length !== createProductDto.Color.length) {
        throw new NotFoundException({
          message: 'One or more colors not found',
        });
      }

      const newPrd = await this.prisma.product.create({
        data: {
          ...createProductDto,
          userId: req['user-id'],
          Color: { connect: createProductDto.Color.map((id) => ({ id })) },
        },
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
      if (error != InternalServerErrorException) {
        throw error;
      }
      console.log(error);
      throw new InternalServerErrorException({ message: 'Server error' });
    }
  }

  async findAll(query: any) {
    try {
      const {
        createdAt = 'desc',
        name,
        sortName = 'asc',
        minPrice,
        maxPrice,
        sortPrice = 'asc',
        page = 1,
        limit = 10,
      } = query;

      const where: any = {};

      if (name) {
        where.name = { contains: name, mode: 'insensitive' };
      }

      if (minPrice || maxPrice) {
        where.price = {};
        if (minPrice) where.price.gte = Number(minPrice);
        if (maxPrice) where.price.lte = Number(maxPrice);
      }

      const orderBy: any[] = [];

      if (createdAt) {
        orderBy.push({ createdAt });
      }

      if (sortName) {
        orderBy.push({ name: sortName });
      }

      if (sortPrice) {
        orderBy.push({ price: sortPrice });
      }

      const skip = (Number(page) - 1) * Number(limit);
      const take = Number(limit);

      const all = await this.prisma.product.findMany({
        where,
        include: {
          category: true,
          user: { select: { id: true, firstname: true, email: true } },
          _count: {
            select: {
              Views: true,
            },
          },
          Comments: {
            select: {
              user: { select: { id: true, firstname: true } },
              text: true,
              star: true,
            },
          },
          Color: true,
        },
        orderBy,
        skip,
        take,
      });

      const productsWithAvgStars = all.map((product) => {
        const stars = product.Comments.map((comment) => comment.star);
        const averageStar =
          stars.length > 0
            ? Number(
                (
                  stars.reduce((sum, star) => sum + star, 0) / stars.length
                ).toFixed(1),
              )
            : 0;

        const discount = product.discount || 0;
        const finalPrice = discount
          ? Number((product.price * (1 - discount / 100)).toFixed(2))
          : product.price;

        return {
          ...product,
          averageStar,
          finalPrice,
        };
      });

      const total = await this.prisma.product.count({ where });

      return {
        data: productsWithAvgStars,
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      if (error != InternalServerErrorException) {
        throw error;
      }
      console.log(error);
      throw new InternalServerErrorException({ message: 'Server error' });
    }
  }

  async findOne(id: number, req: Request) {
    try {
      const one = await this.prisma.product.findUnique({
        where: { id },
        include: {
          category: true,
          user: { select: { id: true, firstname: true, email: true } },
          Comments: {
            select: {
              user: { select: { id: true, firstname: true } },
              text: true,
              star: true,
            },
          },
          Color: true,
        },
      });

      if (!one) {
        throw new NotFoundException({ message: 'Product not found' });
      }

      const stars = one.Comments.map((comment) => comment.star);
      const averageStar =
        stars.length > 0
          ? Number(
              (
                stars.reduce((sum, star) => sum + star, 0) / stars.length
              ).toFixed(1),
            )
          : 0;

      const discount = one.discount || 0;
      const finalPrice = discount
        ? Number((one.price * (1 - discount / 100)).toFixed(2))
        : one.price;

      if (req['user-id']) {
        const viewed = await this.prisma.views.findFirst({
          where: { productId: id, userId: req['user-id'] },
        });

        if (!viewed) {
          await this.prisma.views.create({
            data: { productId: id, userId: req['user-id'] },
          });
        }
      }

      return {
        ...one,
        averageStar,
        finalPrice,
      };
    } catch (error) {
      if (error != InternalServerErrorException) {
        throw error;
      }
      console.log(error);
      throw new InternalServerErrorException({ message: 'Server error' });
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto, req: Request) {
    try {
      if (req['user-role'] == 'ADMIN' || req['user-role'] == 'SUPERADMIN') {
        const existingProduct = await this.prisma.product.findUnique({
          where: { id },
        });

        if (!existingProduct) {
          throw new NotFoundException('Product not found');
        }
        const updated = await this.prisma.product.update({
          where: { id },
          data: {
            ...updateProductDto,
            Color: {
              set: updateProductDto.Color?.map((id) => ({ id })),
            },
          },
        });

        if (!updated) {
          throw new NotFoundException({ message: 'Product not found' });
        }
        return updated;
      }

      const existingProduct = await this.prisma.product.findUnique({
        where: { id },
      });

      if (!existingProduct) {
        throw new NotFoundException('Product not found');
      }
      const updated = await this.prisma.product.update({
        where: { id },
        data: {
          ...updateProductDto,
          Color: {
            set: updateProductDto.Color?.map((id) => ({ id })),
          },
        },
      });
      if (!updated) {
        throw new NotFoundException({ message: 'Product not found' });
      }
      return updated;
    } catch (error) {
      if (error != InternalServerErrorException) {
        throw error;
      }
      console.log(error);
      throw new InternalServerErrorException({ message: 'Server error' });
    }
  }

  async remove(id: number, req: Request) {
    try {
      if (req['user-role'] == 'ADMIN') {
        const exists = await this.prisma.product.findUnique({ where: { id } });
        if (!exists) {
          throw new NotFoundException({ message: 'Product not found' });
        }
        const deleted = await this.prisma.product.delete({ where: { id } });
        if (!deleted) {
          throw new NotFoundException({ message: 'Product not found' });
        }
        return deleted;
      }
      const exists = await this.prisma.product.findUnique({ where: { id } });
      if (!exists) {
        throw new NotFoundException({ message: 'Product not found' });
      }
      const deleted = await this.prisma.product.delete({
        where: { id, userId: req['user-id'] },
      });
      if (!deleted) {
        throw new NotFoundException({ message: 'Product not found' });
      }
      return deleted;
    } catch (error) {
      if (error != InternalServerErrorException) {
        throw error;
      }
      console.log(error);
      throw new InternalServerErrorException({ message: 'Server error' });
    }
  }

  async like(id: number, req: Request) {
    try {
      const product = await this.prisma.product.findUnique({ where: { id } });

      if (!product) {
        throw new NotFoundException({ message: 'Product not found' });
      }

      const liked = await this.prisma.likes.findFirst({
        where: { productId: id, userId: req['user-id'] },
      });
      if (liked) {
        throw new BadRequestException({ message: 'You alredy liked this one' });
      }
      const like = await this.prisma.likes.create({
        data: { productId: id, userId: req['user-id'] },
      });
      return like;
    } catch (error) {
      if (error != InternalServerErrorException) {
        throw error;
      }
      console.log(error);
      throw new InternalServerErrorException({ message: 'Server error' });
    }
  }

  async dislike(id: number, req: Request) {
    try {
      const liked = await this.prisma.likes.findFirst({
        where: { productId: id, userId: req['user-id'] },
      });

      if (!liked) {
        throw new ForbiddenException({ message: 'Like not found' });
      }

      const disliked = await this.prisma.likes.delete({
        where: { id: liked.id },
      });

      return disliked;
    } catch (error) {
      if (error != InternalServerErrorException) {
        throw error;
      }
      console.log(error);
      throw new InternalServerErrorException({ message: 'Server error' });
    }
  }
}
