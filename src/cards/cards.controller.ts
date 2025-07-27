import { Body, Controller, Get, Post } from '@nestjs/common';
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
}
