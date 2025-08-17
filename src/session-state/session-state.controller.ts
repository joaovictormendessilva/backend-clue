import { Body, Controller, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { SessionStateService } from './session-state.service';
import { CreateSessionStateDto } from './dto/create-session-state.dto';
import { JoinSessionStateDto } from './dto/join-session-state.dto';
import { LeaveSessionStateDto } from './dto/leave-session-state.dto';
import { CancelSessionStateDto } from './dto/cancel-session-state.dto';
import { StartSessionStateDto } from './dto/start-session-state.dto';
import { FinishSessionStateDto } from './dto/finish-session-state.dto';

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

  @Put('leave/:id')
  async leaveSessionState(@Param('id', ParseIntPipe) id: number, @Body() leaveSessionStateDto: LeaveSessionStateDto) {
    return await this.sessionStateService.leaveSession(id, leaveSessionStateDto);
  }

  @Put('start/:id')
  async startSessionState(@Param('id', ParseIntPipe) id: number, @Body() startSessionStateDto: StartSessionStateDto) {
    return await this.sessionStateService.startSessionState(id, startSessionStateDto);
  }

  @Put('finish/:id')
  async finishSessionState(
    @Param('id', ParseIntPipe) id: number,
    @Body() finishSessionStateDto: FinishSessionStateDto,
  ) {
    return await this.sessionStateService.finishSessionState(id, finishSessionStateDto);
  }

  @Put('cancel/:id')
  async cancelSessionState(
    @Param('id', ParseIntPipe) id: number,
    @Body() cancelSessionStateDto: CancelSessionStateDto,
  ) {
    return await this.sessionStateService.cancelSessionState(id, cancelSessionStateDto);
  }
}
