import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SessionService } from 'src/session/session.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class SessionStateValidator {
  private readonly playersLimit = 4;

  constructor(
    private readonly userService: UserService,
    private readonly sessionService: SessionService,
    private readonly prismaService: PrismaService,
  ) {}

  async ensureUserExists(userId: number) {
    return await this.userService.getById(userId);
  }

  async ensureSessionExists(sessionId: number) {
    return await this.sessionService.getById(sessionId);
  }

  async ensureSessionStateExists(sessionStateId: number) {
    const sessionState = await this.prismaService.sessionState.findFirst({
      where: {
        id: sessionStateId,
      },
    });

    if (!sessionState) {
      throw new NotFoundException('Session State not found!');
    }

    return sessionState;
  }

  async ensureSessionStateNotExistsForSession(sessionId: number) {
    const hasSessionState = await this.prismaService.sessionState.findFirst({
      where: {
        sessionId,
      },
    });

    if (hasSessionState) {
      throw new ConflictException('This SessionState already exists for this Session!');
    }
  }

  async ensurePlayerExistsInSession(userId: number, sessionStateId: number) {
    const player = await this.prismaService.player.findFirst({
      where: {
        userId,
        sessionStateId,
      },
    });

    if (!player) {
      throw new NotFoundException('Player not found in the session state!');
    }

    return player;
  }

  async ensureCanAddPlayer(sessionStateId: number) {
    const playersInSessionState = await this.prismaService.player.count({
      where: {
        sessionStateId,
      },
    });

    if (playersInSessionState >= this.playersLimit) {
      throw new ConflictException(`SessionState already has ${this.playersLimit} players`);
    }
  }

  async ensurePlayerIsNotInTheSessionState(userId: number, sessionStateId: number) {
    const playerAlreadyExists = await this.prismaService.player.findFirst({
      where: {
        userId,
        sessionStateId,
      },
    });

    if (playerAlreadyExists) {
      throw new ConflictException('Player already joined this SessionState.');
    }
  }
}
