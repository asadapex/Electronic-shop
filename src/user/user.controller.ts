import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';

import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { Roles } from 'src/roles.decorator';
import { UserRoles } from '@prisma/client';
import { AuthguardGuard } from 'src/authguard/authguard.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';
import { SortOrder } from 'src/enums';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(UserRoles.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthguardGuard)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Roles(UserRoles.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthguardGuard)
  @ApiQuery({
    name: 'createdAt',
    required: false,
    default: 1,
    enum: SortOrder,
  })
  @ApiQuery({ name: 'sortByName', required: false, enum: SortOrder })
  @ApiQuery({ name: 'regionId', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, default: 10, type: Number })
  @ApiQuery({ name: 'page', required: false, default: 1, type: Number })
  @Get()
  findAll(@Query() query: any) {
    return this.userService.findAll(query);
  }

  @Roles(UserRoles.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthguardGuard)
  @ApiResponse({
    status: 200,
    description: 'Foydalanuvchi topildi',
  })
  @ApiResponse({ status: 404, description: 'Foydalanuvchi topilmadi' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Roles(UserRoles.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthguardGuard)
  @ApiResponse({
    status: 200,
    description: 'Foydalanuvchi topildi',
  })
  @ApiResponse({ status: 404, description: 'Foydalanuvchi topilmadi' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Roles(UserRoles.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthguardGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
