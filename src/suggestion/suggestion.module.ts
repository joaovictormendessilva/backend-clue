import { Module } from '@nestjs/common';
import { SuggestionService } from './suggestion.service';
import { SuggestionController } from './suggestion.controller';
import { SuggestionValidator } from './validators/suggestion.validator';
import { SessionModule } from 'src/session/session.module';

@Module({
  providers: [SuggestionService, SuggestionValidator],
  controllers: [SuggestionController],
  imports: [SessionModule],
})
export class SuggestionModule {}
