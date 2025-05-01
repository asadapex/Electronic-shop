import { ApiProperty } from '@nestjs/swagger';
import { CategoryEnum } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ type: String, example: 'Category 1' })
  @IsString()
  name: string;

  @ApiProperty({ type: String, example: 'image link' })
  @IsOptional()
  @IsString()
  photo?: string;

  @ApiProperty({ enum: CategoryEnum, example: CategoryEnum.Phone })
  @IsEnum(CategoryEnum)
  type: CategoryEnum;
}
