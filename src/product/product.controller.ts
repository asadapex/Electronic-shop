import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Request } from 'express';
import { AuthguardGuard } from 'src/authguard/authguard.guard';
import { ApiQuery } from '@nestjs/swagger';
import { SortOrder } from 'src/enums';
import { ViewGuard } from 'src/view/view.guard';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(AuthguardGuard)
  @Post()
  create(@Body() createProductDto: CreateProductDto, @Req() req: Request) {
    return this.productService.create(createProductDto, req);
  }

  @Get()
  @ApiQuery({ name: 'createdAt', enum: SortOrder, required: false })
  @ApiQuery({ name: 'name', type: String, required: false })
  @ApiQuery({ name: 'sortName', enum: SortOrder, required: false })
  @ApiQuery({ name: 'minPrice', type: Number, required: false })
  @ApiQuery({ name: 'maxPrice', type: Number, required: false })
  @ApiQuery({ name: 'sortPrice', enum: SortOrder, required: false })
  @ApiQuery({ name: 'color', type: String, default: 'Qizil', required: false })
  @ApiQuery({ name: 'categoryId', type: Number, default: 1, required: false })
  @ApiQuery({ name: 'limit', type: Number, default: 10, required: false })
  @ApiQuery({ name: 'page', type: Number, default: 1, required: false })
  findAll(@Query() query: any) {
    return this.productService.findAll(query);
  }

  @UseGuards(ViewGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.productService.findOne(+id, req);
  }

  @UseGuards(AuthguardGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Req() req: Request,
  ) {
    return this.productService.update(+id, updateProductDto, req);
  }

  @UseGuards(AuthguardGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.productService.remove(+id, req);
  }

  @UseGuards(AuthguardGuard)
  @Post('like/:id')
  like(@Param('id') id: string, @Req() req: Request) {
    return this.productService.like(+id, req);
  }

  @UseGuards(AuthguardGuard)
  @Delete('dislike/:id')
  dislike(@Param('id') id: string, @Req() req: Request) {
    return this.productService.dislike(+id, req);
  }
}
