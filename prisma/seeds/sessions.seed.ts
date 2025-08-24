import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createSessions = async () => {
  return await prisma.session.createMany({
    data: [{ ownerId: 1 }, { ownerId: 2 }, { ownerId: 3 }],
  });
};
