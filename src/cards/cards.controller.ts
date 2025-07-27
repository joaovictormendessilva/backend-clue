import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CardType } from '@prisma/client';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto/create-card.dto';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post('create')
  async create(@Body() cardDto: CreateCardDto) {
    return await this.cardsService.create(cardDto);
  }

  @Get('getAll')
  async getAll() {
    return await this.cardsService.getAll();
  }

  @Get('getByType')
  async getByType(@Query('type') type: CardType) {
    return await this.cardsService.getByType(type);
  }
}
