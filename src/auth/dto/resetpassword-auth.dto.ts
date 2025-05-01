import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class ResetPasswordAuthDto {
  @IsString()
  @IsEmail()
  @ApiProperty({ type: String, example: 'johndoe@gmail.com' })
  email: string;

  @IsString()
  @MinLength(5)
  @MaxLength(5)
  @ApiProperty({ type: String, example: '12345' })
  otp: string;

  @IsString()
  @MinLength(4)
  @MaxLength(12)
  newPassword: string;
}
