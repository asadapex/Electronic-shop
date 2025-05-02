import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateColorDto {
  @ApiProperty({ type: String, example: 'Qizil' })
  @IsString()
  @MinLength(2)
  name: string;
}
