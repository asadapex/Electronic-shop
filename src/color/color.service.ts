import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ColorService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createColorDto: CreateColorDto) {
    const color = await this.prisma.color.findFirst({
      where: { name: createColorDto.name },
    });
    if (color) {
      throw new BadRequestException({ message: 'Color already exists' });
    }
    const newColor = await this.prisma.color.create({ data: createColorDto });
    return newColor;
  }

  async findAll() {
    const all = await this.prisma.color.findMany();
    return all;
  }

  async findOne(id: number) {
    const one = await this.prisma.color.findUnique({ where: { id } });
    if (!one) {
      throw new NotFoundException({ message: 'Color not found' });
    }
    return one;
  }

  async update(id: number, updateColorDto: UpdateColorDto) {
    const exists = await this.prisma.color.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFoundException({ message: 'Color not found' });
    }
    const updated = await this.prisma.color.update({
      where: { id },
      data: updateColorDto,
    });
    if (!updated) {
      throw new NotFoundException({ message: 'Color not found' });
    }
    return updated;
  }

  async remove(id: number) {
    const exists = await this.prisma.color.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFoundException({ message: 'Color not found' });
    }
    const deleted = await this.prisma.color.delete({ where: { id } });
    if (!deleted) {
      throw new NotFoundException({ message: 'Color not found' });
    }
    return deleted;
  }
}
