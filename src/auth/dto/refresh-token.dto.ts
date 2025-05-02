import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({ type: String, example: 'refresh token' })
  @IsString()
  refresh_token: string;
}
