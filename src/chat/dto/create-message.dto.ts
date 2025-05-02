import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty({ type: Number, example: 1 })
  toId: number;

  @ApiProperty({ type: Number, example: 2 })
  chatId: number;
}
