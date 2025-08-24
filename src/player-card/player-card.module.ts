import { forwardRef, Module } from '@nestjs/common';
import { CardModule } from 'src/card/card.module';
import { PlayerModule } from 'src/player/player.module';
import { SessionStateModule } from 'src/session-state/session-state.module';
import { PlayerCardController } from './player-card.controller';
import { PlayerCardService } from './player-card.service';
import { PlayerCardValidator } from './validators/player-card.validator';

@Module({
  providers: [PlayerCardService, PlayerCardValidator],
  controllers: [PlayerCardController],
  imports: [CardModule, PlayerModule, forwardRef(() => SessionStateModule)],
  exports: [PlayerCardService],
})
export class PlayerCardModule {}
