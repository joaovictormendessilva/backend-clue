import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCardDto } from './dto/create-card.dto/create-card.dto';

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
}
