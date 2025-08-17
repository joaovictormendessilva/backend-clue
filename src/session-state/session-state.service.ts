import { Injectable, NotFoundException } from '@nestjs/common';
import { SessionStateStatusType } from '@prisma/client';
import { handlePrismaError } from 'src/prisma/common/prisma-error-handling';
import { PrismaService } from 'src/prisma/prisma.service';
import { SessionStateValidator } from 'src/session-state/validators/session-state.validator';
import { CreateSessionStateDto } from './dto/create-session-state.dto';
import { JoinSessionStateDto } from './dto/join-session-state.dto';
import { LeaveSessionStateDto } from './dto/leave-session-state.dto';
import { CancelSessionStateDto } from './dto/cancel-session-state.dto';
import { StartSessionStateDto } from './dto/start-session-state.dto';
import { FinishSessionStateDto } from './dto/finish-session-state.dto';

@Injectable()
export class SessionStateService {
  private readonly resourceName = {
    sessionState: 'SessionState',
  };

  constructor(
    private readonly sessionStateValidator: SessionStateValidator,
    private readonly prismaService: PrismaService,
  ) {}

  async createWithFirstPlayer(createSessionStateDto: CreateSessionStateDto) {
    try {
      const { sessionId, userId } = createSessionStateDto;

      await this.sessionStateValidator.ensureSessionStateNotExistsForSession(sessionId);
      await this.sessionStateValidator.ensureSessionExists(sessionId);
      await this.sessionStateValidator.ensureUserExists(userId);

      const sessionState = await this.prismaService.sessionState.create({
        data: {
          session: { connect: { id: sessionId } },
          players: {
            create: {
              user: {
                connect: {
                  id: userId,
                },
              },
            },
          },
        },
        include: {
          players: true,
          session: true,
        },
      });

      return sessionState;
    } catch (error) {
      handlePrismaError(error, this.resourceName.sessionState);
    }
  }

  async getAll() {
    const sessionStates = await this.prismaService.sessionState.findMany({
      include: {
        players: true,
        session: true,
      },
    });

    return sessionStates;
  }

  async joinSession(sessionStateId: number, joinSessionDto: JoinSessionStateDto) {
    const { userId } = joinSessionDto;

    try {
      await this.sessionStateValidator.ensureSessionStateIsNotCancelled(sessionStateId);

      await this.sessionStateValidator.ensureUserExists(userId);

      await this.sessionStateValidator.ensureCanAddPlayer(sessionStateId);

      await this.sessionStateValidator.ensurePlayerIsNotInTheSessionState(userId, sessionStateId);

      const updatedSessionState = await this.prismaService.sessionState.update({
        data: {
          players: {
            create: {
              userId: userId,
            },
          },
        },
        where: {
          id: sessionStateId,
        },
        include: {
          players: true,
          session: true,
        },
      });

      return updatedSessionState;
    } catch (error) {
      handlePrismaError(error, this.resourceName.sessionState);
    }
  }

  async getById(id: number) {
    const sessionState = await this.prismaService.sessionState.findUnique({
      where: {
        id,
      },
      include: {
        players: true,
        session: true,
      },
    });

    if (!sessionState) {
      throw new NotFoundException(`${this.resourceName.sessionState} not found!`);
    }

    return sessionState;
  }

  async leaveSession(id: number, leaveSessionStateDto: LeaveSessionStateDto) {
    const { sessionId, userId } = leaveSessionStateDto;

    await this.sessionStateValidator.ensureSessionStateExists(id);
    await this.sessionStateValidator.ensureUserExists(userId);
    await this.sessionStateValidator.ensureSessionExists(sessionId);

    const player = await this.sessionStateValidator.ensurePlayerExistsInSession(userId, id);

    await this.prismaService.player.delete({
      where: {
        id: player.id,
        sessionStateId: id,
      },
    });

    const shouldCancel = await this.sessionStateValidator.ensureShouldCancelAfterLeave(id);

    if (shouldCancel) {
      await this.updateSessionStateToCancelled(id);
    }

    const sessionState = await this.prismaService.sessionState.findUnique({
      where: {
        id,
      },
      include: {
        players: true,
        session: true,
      },
    });

    return sessionState;
  }

  async startSessionState(sessionStateId: number, startSessionStateDto: StartSessionStateDto) {
    const { sessionId, userId } = startSessionStateDto;

    await this.sessionStateValidator.ensureSessionExists(sessionId);
    await this.sessionStateValidator.ensureSessionStateExists(sessionStateId);
    await this.sessionStateValidator.ensureUserExists(userId);
    await this.sessionStateValidator.ensurePlayerIsTheSessionOwner(sessionId, userId);
    await this.sessionStateValidator.ensureSessionStateIsNotCancelled(sessionStateId);
    await this.sessionStateValidator.ensureSessionStateIsNotFinished(sessionStateId);
    await this.sessionStateValidator.ensureSessionStateIsNotStarted(sessionStateId);

    const updatedSessionState = await this.updateSessionStateToStarted(sessionStateId);

    return updatedSessionState;
  }

  async finishSessionState(sessionStateId: number, finishSessionStateDto: FinishSessionStateDto) {
    const { sessionId, userId } = finishSessionStateDto;

    await this.sessionStateValidator.ensureSessionExists(sessionId);
    await this.sessionStateValidator.ensureSessionStateExists(sessionStateId);
    await this.sessionStateValidator.ensureUserExists(userId);
    await this.sessionStateValidator.ensurePlayerIsTheSessionOwner(sessionId, userId);
    await this.sessionStateValidator.ensureSessionStateIsNotCancelled(sessionStateId);
    await this.sessionStateValidator.ensureSessionStateIsNotFinished(sessionStateId);

    const updatedSessionState = await this.updateSessionStateToFinished(sessionStateId);

    return updatedSessionState;
  }

  async cancelSessionState(sessionStateId: number, cancelSessionStateDto: CancelSessionStateDto) {
    const { sessionId, userId } = cancelSessionStateDto;

    await this.sessionStateValidator.ensureSessionExists(sessionId);
    await this.sessionStateValidator.ensureSessionStateExists(sessionStateId);
    await this.sessionStateValidator.ensureUserExists(userId);
    await this.sessionStateValidator.ensurePlayerIsTheSessionOwner(sessionId, userId);
    await this.sessionStateValidator.ensureSessionStateIsNotCancelled(sessionStateId);
    await this.sessionStateValidator.ensureSessionStateIsNotFinished(sessionStateId);

    const updatedSessionState = await this.updateSessionStateToCancelled(sessionStateId);

    return updatedSessionState;
  }

  private async updateSessionStateToStarted(id: number) {
    const startedSessionState = await this.prismaService.sessionState.update({
      where: {
        id,
      },
      data: {
        status: SessionStateStatusType.Started,
      },
      include: {
        players: true,
        session: true,
      },
    });

    return startedSessionState;
  }

  private async updateSessionStateToFinished(id: number) {
    const finishedSessionState = await this.prismaService.sessionState.update({
      where: {
        id,
      },
      data: {
        status: SessionStateStatusType.Finished,
      },
      include: {
        players: true,
        session: true,
      },
    });

    return finishedSessionState;
  }

  private async updateSessionStateToCancelled(id: number) {
    const cancelledSessionState = await this.prismaService.sessionState.update({
      where: {
        id,
      },
      data: {
        status: SessionStateStatusType.Cancelled,
      },
      include: {
        players: true,
        session: true,
      },
    });

    return cancelledSessionState;
  }
}
