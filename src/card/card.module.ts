import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { CardValidator } from './validators/card.validator';

@Module({
  providers: [CardService, CardValidator],
  controllers: [CardController],
  exports: [CardValidator],
})
export class CardModule {}
