import { CardType, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createCards = async () => {
  return await prisma.card.createMany({
    data: [
      { name: 'ABAJUR', type: CardType.Weapon },
      { name: 'FACA', type: CardType.Weapon },
      { name: 'MARTELO', type: CardType.Weapon },
      { name: 'TESOURA DE PODA', type: CardType.Weapon },
      { name: 'VENENO', type: CardType.Weapon },
      { name: 'REVOLVER', type: CardType.Weapon },
      { name: 'CHAVE DE BOCA', type: CardType.Weapon },

      { name: 'VIZINHO', type: CardType.Suspect },
      { name: 'JARDINEIRO', type: CardType.Suspect },
      { name: 'MOTORISTA', type: CardType.Suspect },
      { name: 'MORDOMO', type: CardType.Suspect },
      { name: 'EMPREGADA', type: CardType.Suspect },
      { name: 'ESPOSA', type: CardType.Suspect },
      { name: 'COZINHEIRO', type: CardType.Suspect },

      { name: 'BANHEIRO', type: CardType.Room },
      { name: 'SUITE', type: CardType.Room },
      { name: 'SALA DE JANTAR', type: CardType.Room },
      { name: 'VARANDA', type: CardType.Room },
      { name: 'COZINHA', type: CardType.Room },
      { name: 'HALL CENTRAL', type: CardType.Room },
      { name: 'ESCADARIA', type: CardType.Room },
      { name: 'ESCRITÓRIO', type: CardType.Room },
      { name: 'BIBLIOTECA', type: CardType.Room },
      { name: 'QUARTO', type: CardType.Room },
    ],
  });
};
