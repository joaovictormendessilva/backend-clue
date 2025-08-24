import { IsNumber } from 'class-validator';

export class CreatePlayerCardDto {
  @IsNumber({}, { message: 'CardId is required!' })
  cardId: number;

  @IsNumber({}, { message: 'PlayerId is required!' })
  playerId: number;

  @IsNumber({}, { message: 'SessionStateId is required!' })
  sessionStateId: number;
}
