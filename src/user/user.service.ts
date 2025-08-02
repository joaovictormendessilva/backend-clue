import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto';
import { handlePrismaError } from 'src/prisma/common/prisma-error-handling';

@Injectable()
export class UserService {
  private readonly resourceName = {
    email: 'Email',
  };

  constructor(private readonly prisma: PrismaService) {}

  async create(userDto: CreateUserDto) {
    const { email, name, password } = userDto;

    try {
      const user = await this.prisma.user.create({
        data: {
          email,
          name,
          password,
        },
      });

      return user;
    } catch (error) {
      handlePrismaError(error, this.resourceName.email);
    }
  }
}
