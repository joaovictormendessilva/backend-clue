import { Body, Controller, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { SessionStateService } from './session-state.service';
import { CreateSessionStateDto } from './dto/create-session-state.dto';
import { JoinSessionStateDto } from './dto/join-session-state.dto';

@Controller('session-state')
export class SessionStateController {
  constructor(private readonly sessionStateService: SessionStateService) {}

  @Post('createWithFirstPlayer')
  async createWithFirstPlayer(@Body() createSessionStateDto: CreateSessionStateDto) {
    return await this.sessionStateService.createWithFirstPlayer(createSessionStateDto);
  }

  @Get('getAll')
  async getAll() {
    return await this.sessionStateService.getAll();
  }

  @Put('joinSession/:sessionStateId')
  async joinSession(
    @Param('sessionStateId', ParseIntPipe) sessionStateId: number,
    @Body() joinSessionDto: JoinSessionStateDto,
  ) {
    return await this.sessionStateService.joinSession(sessionStateId, joinSessionDto);
  }
}
