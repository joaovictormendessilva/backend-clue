import { Body, Controller, Get, Post } from '@nestjs/common';
import { PlayerCardService } from './player-card.service';
import { CreatePlayerCardDto } from './dto/create-player-card.dto';

@Controller('player-card')
export class PlayerCardController {
  constructor(private readonly playerCardService: PlayerCardService) {}

  @Post('create')
  async create(@Body() createPlayerCardDto: CreatePlayerCardDto) {
    return await this.playerCardService.create(createPlayerCardDto);
  }

  @Get('getAll')
  async getAll() {
    return await this.playerCardService.getAll();
  }
}
