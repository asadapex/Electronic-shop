import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateAuthDto {
  @IsString()
  @ApiProperty({ type: String, example: 'John' })
  firstname: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, example: 'Doe' })
  lastname?: string;

  @IsString()
  @IsEmail()
  @ApiProperty({ type: String, example: 'johndoe@gmail.com' })
  email: string;

  @IsString()
  @MinLength(4)
  @MaxLength(12)
  @ApiProperty({ type: String, example: 'password123' })
  password: string;

  @IsNumber()
  @ApiProperty({ type: Number, example: 1 })
  regionId: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, example: 'image link' })
  photo?: string;
}
