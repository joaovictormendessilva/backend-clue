import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createSessionsState = async () => {
  return await Promise.all([
    prisma.sessionState.create({
      data: {
        session: {
          connect: {
            id: 1,
          },
        },
        players: {
          create: {
            user: {
              connect: {
                id: 1,
              },
            },
          },
        },
      },
    }),

    prisma.sessionState.create({
      data: {
        session: {
          connect: {
            id: 2,
          },
        },
        players: {
          create: {
            user: {
              connect: {
                id: 2,
              },
            },
          },
        },
      },
    }),

    prisma.sessionState.create({
      data: {
        session: {
          connect: {
            id: 3,
          },
        },
        players: {
          create: {
            user: {
              connect: {
                id: 3,
              },
            },
          },
        },
      },
    }),
  ]);
};
