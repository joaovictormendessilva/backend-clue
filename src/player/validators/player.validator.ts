import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PlayerValidator {
  constructor(private readonly prismaService: PrismaService) {}

  async ensurePlayerExistsInSessionState(playerId: number, sessionStateId: number) {
    const player = await this.prismaService.player.findFirst({
      where: {
        id: playerId,
        sessionStateId,
      },
    });

    if (!player) {
      throw new NotFoundException('Player not found in session state');
    }
  }
}
