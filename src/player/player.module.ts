import { Module } from '@nestjs/common';
import { PlayerValidator } from './validators/player.validator';
import { PlayerService } from './player.service';

@Module({
  providers: [PlayerValidator, PlayerService],
  exports: [PlayerValidator, PlayerService],
})
export class PlayerModule {}
