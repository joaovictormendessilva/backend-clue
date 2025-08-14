import { IsNotEmpty } from 'class-validator';

export class CreateSessionDto {
  @IsNotEmpty({ message: 'UserId is Required!' })
  userId: number;
}
