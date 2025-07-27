import { CardType } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class CreateCardDto {
  @IsNotEmpty({ message: 'Name is required!' })
  name: string;

  @IsEnum(CardType, { message: 'Card type invalid!' })
  @IsNotEmpty({ message: 'Type is required!' })
  type: CardType;
}
