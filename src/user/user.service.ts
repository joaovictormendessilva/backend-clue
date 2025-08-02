import { Injectable } from '@nestjs/common';
import { handlePrismaError } from 'src/prisma/common/prisma-error-handling';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto';
import { ResponseUserDto } from './dto/response-user.dto/response-user.dto';
import { UpdateUserDto } from './dto/update-user.dto/update-user.dto';

@Injectable()
export class UserService {
  private readonly resourceName = {
    email: 'Email',
    user: 'User',
  };

  constructor(private readonly prisma: PrismaService) {}

  async create(userDto: CreateUserDto): Promise<ResponseUserDto | undefined> {
    const { email, name, password } = userDto;

    try {
      const user = await this.prisma.user.create({
        data: {
          email,
          name,
          password,
        },
        omit: {
          password: true,
        },
      });

      return user;
    } catch (error) {
      handlePrismaError(error, this.resourceName.email);
    }
  }

  async getAll(): Promise<ResponseUserDto[]> {
    const users = await this.prisma.user.findMany({
      omit: {
        password: true,
      },
    });

    return users;
  }

  async update(id: number, userDto: UpdateUserDto): Promise<ResponseUserDto | undefined> {
    try {
      const user = await this.prisma.user.update({
        data: userDto,
        where: {
          id,
        },
        omit: {
          password: true,
        },
      });

      return user;
    } catch (error) {
      handlePrismaError(error, this.resourceName.user);
    }
  }
}
