import { Module } from '@nestjs/common';
import { SessionModule } from 'src/session/session.module';
import { SessionStateController } from './session-state.controller';
import { SessionStateService } from './session-state.service';
import { UserModule } from 'src/user/user.module';

@Module({
  providers: [SessionStateService],
  controllers: [SessionStateController],
  imports: [SessionModule, UserModule],
})
export class SessionStateModule {}
