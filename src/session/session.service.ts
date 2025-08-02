import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SessionService {
  constructor(private readonly prisma: PrismaService) {}

  async create() {
    const session = await this.prisma.session.create({
      data: {},
    });

    return session;
  }

  async getAll() {
    const sessions = await this.prisma.session.findMany();

    return sessions;
  }
}
