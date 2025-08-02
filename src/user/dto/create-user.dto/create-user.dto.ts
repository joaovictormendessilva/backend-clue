import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name is required!' })
  name: string;

  @IsEmail({}, { message: 'Insert a valid email!' })
  @IsNotEmpty({ message: 'Email is required!' })
  email: string;

  @IsNotEmpty({ message: 'Password is required!' })
  password: string;
}
