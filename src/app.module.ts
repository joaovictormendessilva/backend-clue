import { Module } from '@nestjs/common';
import { CardModule } from './card/card.module';
import { PlayerCardModule } from './player-card/player-card.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { SessionStateModule } from './session-state/session-state.module';
import { SessionModule } from './session/session.module';
import { UserModule } from './user/user.module';
import { PlayerModule } from './player/player.module';

@Module({
  imports: [PrismaModule, CardModule, UserModule, SessionModule, SessionStateModule, PlayerCardModule, PlayerModule],
  providers: [PrismaService],
})
export class AppModule {}
