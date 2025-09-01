import { Injectable } from '@nestjs/common';
import { CardType } from '@prisma/client';
import { CardValidator } from 'src/card/validators/card.validator';
import { PlayerValidator } from 'src/player/validators/player.validator';
import { SessionStateValidator } from 'src/session-state/validators/session-state.validator';
import { SessionValidator } from 'src/session/validators/session.validator';

@Injectable()
export class SuggestionValidator {
  constructor(
    private readonly playerValidator: PlayerValidator,
    private readonly sessionValidator: SessionValidator,
    private readonly sessionStateValidator: SessionStateValidator,
    private readonly cardValidator: CardValidator,
  ) {}

  async ensureCanCreateSuggestion(
    userId: number,
    sessionId: number,
    cards: {
      suspectCardId: number;
      roomCardId: number;
      weaponCardId: number;
    },
  ) {
    await this.sessionValidator.ensureSessionExists(sessionId);

    const sessionState = await this.sessionStateValidator.ensureSessionStateExistsBySession(sessionId);

    const player = await this.playerValidator.ensurePlayerExists(userId);

    await this.playerValidator.ensurePlayerExistsInSessionState(player.id, sessionState.id);

    await this.cardValidator.ensureCardIsInTheSessionByType(cards.suspectCardId, CardType.Suspect);

    await this.cardValidator.ensureCardIsInTheSessionByType(cards.roomCardId, CardType.Room);

    await this.cardValidator.ensureCardIsInTheSessionByType(cards.weaponCardId, CardType.Weapon);
  }
}
