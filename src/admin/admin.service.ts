import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRoles, UserStatus } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createAdminDto: CreateAdminDto) {
    const newAdmin = await this.prisma.user.create({
      data: { ...createAdminDto, status: UserStatus.ACTIVE, regionId: 1 },
    });
    return newAdmin;
  }

  async findAll() {
    const all = await this.prisma.user.findMany({
      where: {
        OR: [{ role: UserRoles.ADMIN }, { role: UserRoles.SUPERADMIN }],
      },
    });
    return all;
  }
}
