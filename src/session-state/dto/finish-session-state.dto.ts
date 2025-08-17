import { IsNumber } from 'class-validator';

export class FinishSessionStateDto {
  @IsNumber({}, { message: 'SessionId is required!' })
  sessionId: number;

  @IsNumber({}, { message: 'UserId is required!' })
  userId: number;
}
