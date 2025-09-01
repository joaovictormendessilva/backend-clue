import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SessionValidator {
  constructor(private readonly prismaService: PrismaService) {}

  async ensureSessionExists(sessionId: number) {
    const session = await this.prismaService.session.findFirst({
      where: {
        id: sessionId,
      },
      select: {
        sessionState: true,
      },
    });

    if (!session) {
      throw new NotFoundException('Session not found!');
    }
  }
}
