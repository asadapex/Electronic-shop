import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class ResendOtpAuthDto {
  @IsString()
  @IsEmail()
  @ApiProperty({ type: String, example: 'johndoe@gmail.com' })
  email: string;
}
