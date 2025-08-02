import { ApiProperty } from '@nestjs/swagger';
import { CardType } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateCardDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsEnum(CardType, { message: 'Card type invalid!' })
  @ApiProperty({
    enum: CardType,
  })
  type?: CardType;
}
