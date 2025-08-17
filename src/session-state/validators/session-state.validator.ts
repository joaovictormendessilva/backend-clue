import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { SessionStateStatusType } from '@prisma/client';
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

  async ensureSessionStateIsNotCancelled(sessionStateId: number) {
    const sessionState = await this.prismaService.sessionState.findUnique({
      where: {
        id: sessionStateId,
      },
    });

    const isSessionStateCancelled = sessionState?.status === SessionStateStatusType.Cancelled;

    if (isSessionStateCancelled) {
      throw new ConflictException('This session state is cancelled!');
    }
  }

  async ensureSessionStateIsNotStarted(sessionStateId: number) {
    const sessionState = await this.prismaService.sessionState.findUnique({
      where: {
        id: sessionStateId,
      },
    });

    const isSessionStateAlreadyStarted = sessionState?.status === SessionStateStatusType.Started;

    if (isSessionStateAlreadyStarted) {
      throw new ConflictException('This session state is already started!');
    }
  }

  async ensureSessionStateIsNotFinished(sessionStateId: number) {
    const sessionState = await this.prismaService.sessionState.findUnique({
      where: {
        id: sessionStateId,
      },
    });

    const isSessionStateAlreadyFinished = sessionState?.status === SessionStateStatusType.Finished;

    if (isSessionStateAlreadyFinished) {
      throw new ConflictException('This session state is already finished!');
    }
  }

  async ensureSessionStateOwnerCanUpdateStatus(params: {
    sessionId: number;
    sessionStateId: number;
    userId: number;
    checkNotStarted?: boolean;
    checkNotFinished?: boolean;
  }) {
    const { sessionId, sessionStateId, userId, checkNotStarted, checkNotFinished } = params;

    await this.ensureSessionExists(sessionId);
    await this.ensureSessionStateExists(sessionStateId);
    await this.ensureUserExists(userId);
    await this.ensurePlayerIsTheSessionOwner(sessionId, userId);
    await this.ensureSessionStateIsNotCancelled(sessionStateId);

    if (checkNotFinished) {
      await this.ensureSessionStateIsNotFinished(sessionStateId);
    }

    if (checkNotStarted) {
      await this.ensureSessionStateIsNotStarted(sessionStateId);
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

  async ensureShouldCancelAfterLeave(sessionStateId: number) {
    const playersRemaining = await this.prismaService.player.count({
      where: {
        sessionStateId,
      },
    });

    return playersRemaining === 0;
  }

  async ensurePlayerIsTheSessionOwner(sessionId: number, userId: number) {
    await this.sessionService.validateOwner(sessionId, userId);
  }
}
