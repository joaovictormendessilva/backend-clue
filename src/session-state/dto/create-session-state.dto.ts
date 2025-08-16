import { IsNumber } from 'class-validator';

export class CreateSessionStateDto {
  @IsNumber({}, { message: 'SessionId is required!' })
  sessionId: number;

  @IsNumber({}, { message: 'userId is required!' })
  userId: number;
}
