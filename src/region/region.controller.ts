import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RegionService } from './region.service';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { Roles } from 'src/roles.decorator';
import { UserRoles } from '@prisma/client';
import { RolesGuard } from 'src/roles/roles.guard';
import { AuthguardGuard } from 'src/authguard/authguard.guard';

@Controller('region')
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  @Roles(UserRoles.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthguardGuard)
  @Post()
  create(@Body() createRegionDto: CreateRegionDto) {
    return this.regionService.create(createRegionDto);
  }

  @Get()
  findAll() {
    return this.regionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.regionService.findOne(+id);
  }

  @Roles(UserRoles.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthguardGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRegionDto: UpdateRegionDto) {
    return this.regionService.update(+id, updateRegionDto);
  }

  @Roles(UserRoles.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthguardGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.regionService.remove(+id);
  }
}
