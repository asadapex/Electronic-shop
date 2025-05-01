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
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthguardGuard } from 'src/authguard/authguard.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles.decorator';
import { UserRoles } from '@prisma/client';
import { ApiQuery } from '@nestjs/swagger';
import { SortOrder } from 'src/enums';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Roles(UserRoles.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthguardGuard)
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Roles(UserRoles.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthguardGuard)
  @Get()
  @ApiQuery({ name: 'createdAt', enum: SortOrder, required: false })
  @ApiQuery({ name: 'name', type: String, required: false })
  @ApiQuery({ name: 'sort', enum: SortOrder, required: false })
  @ApiQuery({ name: 'limit', type: Number, default: 10, required: false })
  @ApiQuery({ name: 'page', type: Number, default: 1, required: false })
  findAll(@Query() query: any) {
    return this.categoryService.findAll(query);
  }

  @Roles(UserRoles.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthguardGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Roles(UserRoles.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthguardGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @Roles(UserRoles.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthguardGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
