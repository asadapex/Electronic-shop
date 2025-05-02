import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({ type: Number, example: 1 })
  @IsNumber()
  toId: number;

  @ApiProperty({ type: Number, example: 2 })
  @IsNumber()
  chatId: number;

  @ApiProperty({ type: String, example: 'String' })
  @IsString()
  text: string;
}
