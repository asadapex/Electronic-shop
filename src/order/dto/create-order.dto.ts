import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({ type: Number, example: 1 })
  @IsNumber()
  productId: number;

  @ApiProperty({ type: Number, example: 1 })
  @IsNumber()
  @Min(1)
  count: number;

  @ApiProperty({ type: Number, example: 1 })
  @IsNumber()
  color: number;
}
