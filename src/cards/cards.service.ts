import { Injectable, NotFoundException } from '@nestjs/common';
import { CardType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCardDto } from './dto/create-card.dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto/update-card.dto';
import { handlePrismaError } from 'src/prisma/common/prisma-error-handling';

@Injectable()
export class CardsService {
  private readonly resourceName = 'Card';

  constructor(private readonly prisma: PrismaService) {}

  async create(cardDto: CreateCardDto) {
    const { name, type } = cardDto;

    const card = await this.prisma.card.create({
      data: {
        name,
        type,
      },
    });

    return card;
  }

  async getAll() {
    return await this.prisma.card.findMany();
  }

  async getByType(type: CardType) {
    const cards = await this.prisma.card.findMany({
      where: {
        type,
      },
    });

    return cards;
  }

  async update(id: number, data: UpdateCardDto) {
    try {
      const updatedCard = await this.prisma.card.update({
        where: {
          id,
        },
        data,
      });

      return updatedCard;
    } catch (error) {
      handlePrismaError(error, this.resourceName);
    }
  }

  async delete(id: number) {
    try {
      return await this.prisma.card.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      handlePrismaError(error, this.resourceName);
    }
  }
}
