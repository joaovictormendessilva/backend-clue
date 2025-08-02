import { Controller, Get, Post } from '@nestjs/common';
import { SessionService } from './session.service';

@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post('create')
  async create() {
    return await this.sessionService.create();
  }

  @Get('getAll')
  async getAll() {
    return await this.sessionService.getAll();
  }
}
