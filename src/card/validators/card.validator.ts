import { Injectable, NotFoundException } from '@nestjs/common';
import { CardType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CardValidator {
  constructor(private readonly prismaService: PrismaService) {}

  async ensureCardExists(cardId: number) {
    const card = await this.prismaService.card.findUnique({
      where: {
        id: cardId,
      },
    });

    if (!card) {
      throw new NotFoundException('Card not found!');
    }
  }

  async ensureCardIsInTheSessionByType(cardId: number, type: CardType) {
    const card = await this.prismaService.card.findFirst({
      where: {
        id: cardId,
        type,
      },
    });

    if (!card) {
      throw new NotFoundException(`${type} card not found in the session!`);
    }

    return card;
  }
}
