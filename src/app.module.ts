import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { CardsModule } from './cards/cards.module';

@Module({
  imports: [PrismaModule, CardsModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
