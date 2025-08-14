import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { CardModule } from './card/card.module';
import { UserModule } from './user/user.module';
import { SessionModule } from './session/session.module';

@Module({
  imports: [PrismaModule, CardModule, UserModule, SessionModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
