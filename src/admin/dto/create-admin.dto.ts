import { ApiProperty } from '@nestjs/swagger';
import { UserRoles } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateAdminDto {
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

  @IsEnum(UserRoles)
  @ApiProperty({ type: String, example: UserRoles.ADMIN })
  role: UserRoles;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, example: 'image link' })
  photo?: string;
}
