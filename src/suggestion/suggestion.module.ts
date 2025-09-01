import { forwardRef, Module } from '@nestjs/common';
import { SuggestionService } from './suggestion.service';
import { SuggestionController } from './suggestion.controller';
import { SuggestionValidator } from './validators/suggestion.validator';
import { SessionModule } from 'src/session/session.module';
import { PlayerModule } from 'src/player/player.module';
import { SessionStateModule } from 'src/session-state/session-state.module';
import { CardModule } from 'src/card/card.module';
import { PlayerCardModule } from 'src/player-card/player-card.module';

@Module({
  providers: [SuggestionService, SuggestionValidator],
  controllers: [SuggestionController],
  imports: [SessionStateModule, PlayerCardModule, PlayerModule, SessionModule, CardModule],
})
export class SuggestionModule {}
