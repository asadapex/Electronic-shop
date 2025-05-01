import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginAuthDto {
  @IsString()
  @IsEmail()
  @ApiProperty({ type: String, example: 'johndoe@gmail.com' })
  email: string;

  @IsString()
  @MinLength(4)
  @MaxLength(12)
  @ApiProperty({ type: String, example: 'password123' })
  password: string;
}
