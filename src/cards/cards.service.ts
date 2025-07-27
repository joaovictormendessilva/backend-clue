import { Injectable } from '@nestjs/common';
import { CardType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCardDto } from './dto/create-card.dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto/update-card.dto';

@Injectable()
export class CardsService {
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
    const updatedCard = await this.prisma.card.update({
      where: {
        id,
      },
      data,
    });

    return updatedCard;
  }

  async delete(id: number) {
    return await this.prisma.card.delete({
      where: {
        id,
      },
    });
  }
}
