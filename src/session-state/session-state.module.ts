import { forwardRef, Module } from '@nestjs/common';
import { PlayerCardModule } from 'src/player-card/player-card.module';
import { SessionModule } from 'src/session/session.module';
import { UserModule } from 'src/user/user.module';
import { SessionStateController } from './session-state.controller';
import { SessionStateService } from './session-state.service';
import { SessionStateValidator } from './validators/session-state.validator';

@Module({
  providers: [SessionStateService, SessionStateValidator],
  controllers: [SessionStateController],
  imports: [UserModule, SessionModule, forwardRef(() => PlayerCardModule)],
  exports: [SessionStateValidator],
})
export class SessionStateModule {}
