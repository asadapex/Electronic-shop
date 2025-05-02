import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UserStatus } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findUser(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user;
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const region = await this.prisma.region.findUnique({
        where: { id: createUserDto.regionId },
      });

      if (!region) {
        throw new NotFoundException({ message: 'Region not found' });
      }

      const user = await this.findUser(createUserDto.email);
      if (user) {
        throw new BadRequestException({ message: 'User already exists' });
      }

      const hash = bcrypt.hashSync(createUserDto.password, 10);
      const newUser = await this.prisma.user.create({
        data: { ...createUserDto, status: UserStatus.ACTIVE, password: hash },
      });
      return newUser;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.log(error);
      throw new BadRequestException({ message: 'Something went wrong' });
    }
  }

  async findAll(query: any) {
    try {
      const {
        page = 1,
        limit = 10,
        regionId,
        sortByName = 'asc',
        search,
        createdAt = 'desc',
      } = query;

      const skip = (page - 1) * limit;
      const take = Number(limit);

      const where: any = {};

      if (search) {
        where.OR = [
          { firstname: { contains: search, mode: 'insensitive' } },
          { lastname: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ];
      }

      if (regionId) {
        where.regionId = Number(regionId);
      }

      const orderBy: any[] = [];
      if (sortByName) orderBy.push({ firstname: sortByName });
      if (createdAt) orderBy.push({ createdAt: createdAt });

      const all = await this.prisma.user.findMany({
        where,
        take,
        skip,
        orderBy,
      });

      const total = await this.prisma.user.count({ where });
      return {
        data: all,
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException({ message: 'Something went wrong' });
    }
  }

  async findOne(id: number) {
    try {
      const one = await this.prisma.user.findUnique({
        where: { id },
        include: { region: true },
      });
      if (!one) {
        throw new NotFoundException({ message: 'User not found' });
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

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const exists = await this.prisma.user.findUnique({ where: { id } });
      if (!exists) {
        throw new NotFoundException({ message: 'User not found' });
      }
      const updated = await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
      });

      if (!updated) {
        throw new NotFoundException({ message: 'User not found' });
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
      const exists = await this.prisma.user.findUnique({ where: { id } });
      if (!exists) {
        throw new NotFoundException({ message: 'User not found' });
      }
      const deleted = await this.prisma.user.delete({ where: { id } });
      if (!deleted) {
        throw new NotFoundException({ message: 'User not found' });
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
