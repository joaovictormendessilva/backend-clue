import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { handlePrismaError } from 'src/prisma/common/prisma-error-handling';
import { CreateSessionDto } from './dto/create-session.dto';
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

  @Delete('delete/:id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.sessionService.delete(id);
  }
}
