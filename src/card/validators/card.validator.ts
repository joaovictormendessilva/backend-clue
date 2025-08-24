import { Injectable, NotFoundException } from '@nestjs/common';
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
}
