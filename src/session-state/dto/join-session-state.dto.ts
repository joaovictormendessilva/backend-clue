import { IsNumber } from 'class-validator';

export class JoinSessionStateDto {
  @IsNumber({}, { message: 'UserId is required!' })
  userId: number;
}
