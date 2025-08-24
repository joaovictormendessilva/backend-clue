import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CardType } from '@prisma/client';
import { CardValidator } from 'src/card/validators/card.validator';
import { PlayerValidator } from 'src/player/validators/player.validator';
import { PrismaService } from 'src/prisma/prisma.service';
import { SessionStateValidator } from 'src/session-state/validators/session-state.validator';

@Injectable()
export class PlayerCardValidator {
  private readonly minRoomCardsQty = 9;
  private readonly minSuspectCardsQty = 6;
  private readonly minWeaponCardsQty = 6;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly cardValidator: CardValidator,
    private readonly playerValidator: PlayerValidator,
    private readonly sessionStateValidator: SessionStateValidator,
  ) {}

  async ensureCardIsAvailableForDistribuition(cardId: number, sessionStateId: number) {
    const card = await this.prismaService.playerCard.findFirst({
      where: {
        cardId,
        sessionStateId,
      },
    });

    if (card) {
      throw new ConflictException(`This card has already been distribuited!`);
    }
  }

  async ensureCanCreatePlayerCard(cardId: number, playerId: number, sessionStateId: number) {
    await this.sessionStateValidator.ensureSessionStateExists(sessionStateId);
    await this.playerValidator.ensurePlayerExistsInSessionState(playerId, sessionStateId);
    await this.cardValidator.ensureCardExists(cardId);
    await this.ensureCardIsAvailableForDistribuition(cardId, sessionStateId);
  }

  async ensureEnoughCardsToDistribute() {
    const cards = await this.prismaService.card.findMany();

    const roomCardsQty = cards.filter((card) => card.type === CardType.Room).length;
    const suspectCardsQty = cards.filter((card) => card.type === CardType.Suspect).length;
    const weaponCardsQty = cards.filter((card) => card.type === CardType.Weapon).length;

    if (roomCardsQty < this.minRoomCardsQty)
      throw new BadRequestException(
        `At least ${this.minRoomCardsQty} room cards are required to continue. Currently, there are only ${roomCardsQty}.`,
      );

    if (suspectCardsQty < this.minSuspectCardsQty)
      throw new BadRequestException(
        `At least ${this.minSuspectCardsQty} suspect cards are required to continue. Currently, there are only ${suspectCardsQty}.`,
      );

    if (weaponCardsQty < this.minWeaponCardsQty)
      throw new BadRequestException(
        `At least ${this.minWeaponCardsQty} weapon cards are required to continue. Currently, there are only ${weaponCardsQty}.`,
      );
  }
}
