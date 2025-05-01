import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateRegionDto {
  @ApiProperty({ type: String, example: 'Tashkent' })
  @IsString()
  name: string;
}
