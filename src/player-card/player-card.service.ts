import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePlayerCardDto } from './dto/create-player-card.dto';
import { PlayerCardValidator } from './validators/player-card.validator';
import { CardType } from '@prisma/client';
import { PlayerService } from 'src/player/player.service';

@Injectable()
export class PlayerCardService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly playerCardValidator: PlayerCardValidator,
    private readonly playerService: PlayerService,
  ) {}

  async create(createPlayerCardDto: CreatePlayerCardDto) {
    await this.playerCardValidator.ensureCanCreatePlayerCard(
      createPlayerCardDto.cardId,
      createPlayerCardDto.playerId,
      createPlayerCardDto.sessionStateId,
    );

    return await this.prismaService.playerCard.create({
      data: createPlayerCardDto,
    });
  }

  async getAll() {
    return await this.prismaService.playerCard.findMany();
  }

  async distributeCards(sessionStateId: number) {
    const players = await this.playerService.getSessionPlayers(sessionStateId);

    await this.playerCardValidator.ensureEnoughCardsToDistribute();

    const suspects = await this.prismaService.card.findMany({ where: { type: CardType.Suspect } });
    const weapons = await this.prismaService.card.findMany({ where: { type: CardType.Weapon } });
    const rooms = await this.prismaService.card.findMany({ where: { type: CardType.Room } });

    const trueSuspect = suspects[Math.floor(Math.random() * suspects.length)];
    const trueWeapon = weapons[Math.floor(Math.random() * weapons.length)];
    const trueRoom = rooms[Math.floor(Math.random() * rooms.length)];

    await this.prismaService.sessionState.update({
      where: { id: sessionStateId },
      data: {
        trueSuspectId: trueSuspect.id,
        trueWeaponId: trueWeapon.id,
        trueRoomId: trueRoom.id,
      },
    });

    const excludedIds = [trueSuspect.id, trueWeapon.id, trueRoom.id];
    let remainingCards = await this.prismaService.card.findMany({
      where: { id: { notIn: excludedIds } },
    });

    for (let i = remainingCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [remainingCards[i], remainingCards[j]] = [remainingCards[j], remainingCards[i]];
    }

    const playerCardsData = remainingCards.map((card, idx) => ({
      playerId: players[idx % players.length].id,
      sessionStateId,
      cardId: card.id,
    }));

    await this.prismaService.playerCard.createMany({
      data: playerCardsData,
    });
  }
}
