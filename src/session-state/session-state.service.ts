import { Injectable, NotFoundException } from '@nestjs/common';
import { handlePrismaError } from 'src/prisma/common/prisma-error-handling';
import { PrismaService } from 'src/prisma/prisma.service';
import { SessionStateValidator } from 'src/session-state/validators/session-state.validator';
import { CreateSessionStateDto } from './dto/create-session-state.dto';
import { JoinSessionStateDto } from './dto/join-session-state.dto';
import { LeaveSessionStateDto } from './dto/leave-session-state.dto';

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
}
