import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CardType } from '@prisma/client';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto/update-card.dto';

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

  @Put('update/:id')
  async update(@Param('id') id: number, @Body() updateCardDto: UpdateCardDto) {
    return await this.cardsService.update(id, updateCardDto);
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: number) {
    return await this.cardsService.delete(id);
  }
}
