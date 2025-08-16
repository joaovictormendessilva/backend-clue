import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSessionStateDto } from './dto/create-session-state.dto';
import { SessionService } from 'src/session/session.service';
import { JoinSessionStateDto } from './dto/join-session-state.dto';
import { UserService } from 'src/user/user.service';
import { handlePrismaError } from 'src/prisma/common/prisma-error-handling';

@Injectable()
export class SessionStateService {
  private readonly resourceName = {
    sessionState: 'SessionState',
  };

  private readonly playersLimit = 4;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly sessionService: SessionService,
    private readonly userService: UserService,
  ) {}

  async createWithFirstPlayer(createSessionStateDto: CreateSessionStateDto) {
    try {
      const { sessionId, userId } = createSessionStateDto;

      const hasSessionState = await this.prismaService.sessionState.findFirst({
        where: {
          sessionId,
        },
      });

      if (hasSessionState) {
        throw new ConflictException('This SessionState already exists for this Session!');
      }

      await this.sessionService.getById(sessionId);

      await this.userService.getById(userId);

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
      },
    });

    return sessionStates;
  }

  async joinSession(sessionStateId: number, joinSessionDto: JoinSessionStateDto) {
    const { userId } = joinSessionDto;

    try {
      const playersInSessionState = await this.prismaService.player.count({
        where: {
          sessionStateId,
        },
      });

      if (playersInSessionState >= this.playersLimit) {
        throw new ConflictException(`SessionState already has ${this.playersLimit} players`);
      }

      const playerAlreadyExists = await this.prismaService.player.findFirst({
        where: {
          userId,
          sessionStateId,
        },
      });

      if (playerAlreadyExists) {
        throw new ConflictException('Player already joined this SessionState.');
      }

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
        },
      });

      return updatedSessionState;
    } catch (error) {
      handlePrismaError(error, this.resourceName.sessionState);
    }
  }
}
