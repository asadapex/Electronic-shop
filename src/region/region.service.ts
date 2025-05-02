import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RegionService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createRegionDto: CreateRegionDto) {
    const newRegion = await this.prisma.region.create({
      data: createRegionDto,
    });
    return newRegion;
  }

  async findAll() {
    const all = await this.prisma.region.findMany();
    return all;
  }

  async findOne(id: number) {
    const one = await this.prisma.region.findUnique({ where: { id } });
    if (!one) {
      throw new NotFoundException({ message: 'Region not found' });
    }
    return one;
  }

  async update(id: number, updateRegionDto: UpdateRegionDto) {
    const exists = await this.prisma.region.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFoundException({ message: 'Region not found' });
    }
    const updated = await this.prisma.region.update({
      where: { id },
      data: updateRegionDto,
    });
    if (!updated) {
      throw new NotFoundException({ message: 'Region not found' });
    }
    return updated;
  }

  async remove(id: number) {
    const exists = await this.prisma.region.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFoundException({ message: 'Region not found' });
    }
    const deleted = await this.prisma.region.delete({ where: { id } });
    if (!deleted) {
      throw new NotFoundException({ message: 'Region not found' });
    }
    return deleted;
  }
}
