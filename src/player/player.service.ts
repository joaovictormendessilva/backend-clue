import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PlayerService {
  constructor(private readonly prismaService: PrismaService) {}

  async getSessionPlayers(sessionStateId: number) {
    return await this.prismaService.player.findMany({
      where: {
        sessionStateId,
      },
    });
  }
}
