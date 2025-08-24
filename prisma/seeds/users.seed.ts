import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createUsers = async () => {
  return await prisma.user.createMany({
    data: [
      {
        name: 'Franklin Wisoky',
        email: 'Rupert_Bernier@gmail.com',
        password: '123456',
      },
      {
        name: 'Clayton Fisher',
        email: 'Clovis.Quitzon97@hotmail.com',
        password: '123456',
      },
      {
        name: 'Gordon Brakus',
        email: 'Cooper62@hotmail.com',
        password: '123456',
      },
      {
        name: 'Laurence Mitchell',
        email: 'Doyle57@hotmail.com',
        password: '123456',
      },
    ],
  });
};
