import { Injectable } from '@nestjs/common';
import { handlePrismaError } from 'src/prisma/common/prisma-error-handling';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSessionDto } from './dto/create-session.dto/create-session.dto';

@Injectable()
export class SessionService {
  private readonly resourceName = 'Session';
  constructor(private readonly prisma: PrismaService) {}

  async create(sessionDto: CreateSessionDto) {
    try {
      const session = await this.prisma.session.create({
        data: {
          ownerId: sessionDto.userId,
        },
      });

      return session;
    } catch (error) {
      handlePrismaError(error, this.resourceName);
    }
  }

  async getAll() {
    const sessions = await this.prisma.session.findMany();

    return sessions;
  }
}
