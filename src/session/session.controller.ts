import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto/create-session.dto';
import { SessionService } from './session.service';

@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post('create')
  async create(@Body() sessionDto: CreateSessionDto) {
    return await this.sessionService.create(sessionDto);
  }

  @Get('getAll')
  async getAll() {
    return await this.sessionService.getAll();
  }
}
