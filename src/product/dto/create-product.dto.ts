import { ApiProperty } from '@nestjs/swagger';
import { CategoryEnum, ProducStatus } from '@prisma/client';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ type: String, example: 'image link', required: false })
  @IsString()
  @IsOptional()
  photo?: string;

  @ApiProperty({ type: String, example: 'Product 1', required: true })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({
    type: String,
    example: 'Product description',
    required: true,
  })
  @IsString()
  @MinLength(3)
  description: string;

  @ApiProperty({
    enum: ProducStatus,
    example: ProducStatus.NEW,
    required: true,
  })
  @IsEnum(ProducStatus)
  status: ProducStatus;

  @ApiProperty({ type: Number, example: 123, required: true })
  @IsNumber()
  @Min(1)
  price: number;

  @ApiProperty({ type: Number, example: 15, required: true })
  @IsNumber()
  @Min(1)
  count: number;

  @ApiProperty({ example: [1, 2], required: true })
  @IsNumber()
  @Min(1)
  Color: number[];

  @ApiProperty({ type: Number, example: 10, required: true })
  @IsNumber()
  @Min(0)
  @Max(100)
  discount: number;

  @ApiProperty({
    enum: CategoryEnum,
    example: CategoryEnum.Phone,
    required: true,
  })
  @IsEnum(CategoryEnum)
  type: CategoryEnum;

  @ApiProperty({ type: Number, example: 1, required: true })
  @IsNumber()
  categoryId: number;
}
