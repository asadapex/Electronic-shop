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
import { ColorService } from './color.service';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { AuthguardGuard } from 'src/authguard/authguard.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles.decorator';
import { UserRoles } from '@prisma/client';

@Controller('color')
export class ColorController {
  constructor(private readonly colorService: ColorService) {}

  @Roles(UserRoles.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthguardGuard)
  @Post()
  create(@Body() createColorDto: CreateColorDto) {
    return this.colorService.create(createColorDto);
  }

  @Get()
  findAll() {
    return this.colorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.colorService.findOne(+id);
  }

  @Roles(UserRoles.ADMIN, UserRoles.SUPERADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthguardGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateColorDto: UpdateColorDto) {
    return this.colorService.update(+id, updateColorDto);
  }

  @Roles(UserRoles.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthguardGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.colorService.remove(+id);
  }
}
