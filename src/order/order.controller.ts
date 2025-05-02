import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthguardGuard } from 'src/authguard/authguard.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles.decorator';
import { UserRoles } from '@prisma/client';
import { Request } from 'express';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(AuthguardGuard)
  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @Req() req: Request) {
    return this.orderService.create(createOrderDto, req);
  }

  @Roles(UserRoles.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthguardGuard)
  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @UseGuards(AuthguardGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.orderService.findOne(+id, req);
  }

  @UseGuards(AuthguardGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.orderService.remove(+id, req);
  }
}
