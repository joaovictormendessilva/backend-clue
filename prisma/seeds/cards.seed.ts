import { CardType, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createCards = async () => {
  return await prisma.card.createMany({
    data: [
      {
        name: 'Cozinheiro',
        type: CardType.Suspect,
      },
      {
        name: 'Motorista',
        type: CardType.Suspect,
      },
      {
        name: 'Faxineira',
        type: CardType.Suspect,
      },
      {
        name: 'Faca',
        type: CardType.Weapon,
      },
      {
        name: 'Abajur',
        type: CardType.Weapon,
      },
      {
        name: 'Veneno',
        type: CardType.Weapon,
      },
      {
        name: 'Sala',
        type: CardType.Room,
      },
      {
        name: 'Cozinha',
        type: CardType.Room,
      },
      {
        name: 'Banheiro',
        type: CardType.Room,
      },
    ],
  });
};
