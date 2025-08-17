import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SessionModule } from 'src/session/session.module';
import { UserModule } from 'src/user/user.module';
import { SessionStateController } from './session-state.controller';
import { SessionStateService } from './session-state.service';
import { SessionStateValidator } from './validators/session-state.validator';

@Module({
  providers: [SessionStateService, SessionStateValidator],
  controllers: [SessionStateController],
  imports: [UserModule, SessionModule, PrismaModule],
})
export class SessionStateModule {}
