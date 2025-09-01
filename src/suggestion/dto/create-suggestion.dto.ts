import { IsNumber } from 'class-validator';

export class CreateSuggestionDto {
  @IsNumber({}, { message: 'UserId is required!' })
  userId: number;

  @IsNumber({}, { message: 'SessionId is required!' })
  sessionId: number;

  @IsNumber({}, { message: 'SuspectId is required!' })
  suspectId: number;

  @IsNumber({}, { message: 'RoomId is required!' })
  roomId: number;

  @IsNumber({}, { message: 'WeaponId is required!' })
  weaponId: number;
}
