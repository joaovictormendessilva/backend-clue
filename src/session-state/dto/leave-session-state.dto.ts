import { IsNumber } from 'class-validator';

export class LeaveSessionStateDto {
  @IsNumber({}, { message: 'UserId is required!' })
  userId: number;

  @IsNumber({}, { message: 'SessionId is required!' })
  sessionId: number;
}
