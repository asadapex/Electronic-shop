import { ApiProperty } from '@nestjs/swagger';

export class CreateChatDto {
  @ApiProperty({ type: Number, example: 1 })
  toUser: number;
}
