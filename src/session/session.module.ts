import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { SessionValidator } from './validators/session.validator';

@Module({
  providers: [SessionService, SessionValidator],
  controllers: [SessionController],
  exports: [SessionService, SessionValidator],
})
export class SessionModule {}
