import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Max, MaxLength, Min } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ type: Number, example: 1 })
  @IsNumber()
  productId: number;

  @ApiProperty({ type: String, example: "Zo'r" })
  @IsString()
  @MaxLength(255)
  text: string;

  @ApiProperty({ type: Number, example: 5, minimum: 1, maximum: 5 })
  @Min(1)
  @Max(5)
  star: number;
}
