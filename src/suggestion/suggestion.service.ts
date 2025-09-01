import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSuggestionDto } from './dto/create-suggestion.dto';
import { SuggestionValidator } from './validators/suggestion.validator';

@Injectable()
export class SuggestionService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly suggestionValidator: SuggestionValidator,
  ) {}

  async create(createSuggestionDto: CreateSuggestionDto) {
    await this.suggestionValidator.ensureCanCreateSuggestion(
      createSuggestionDto.userId,
      createSuggestionDto.sessionId,
      {
        roomCardId: createSuggestionDto.roomId,
        suspectCardId: createSuggestionDto.suspectId,
        weaponCardId: createSuggestionDto.weaponId,
      },
    );

    return await this.prismaService.suggestion.create({
      data: {
        userId: createSuggestionDto.userId,
        sessionId: createSuggestionDto.sessionId,
        suspectId: createSuggestionDto.suspectId,
        roomId: createSuggestionDto.roomId,
        weaponId: createSuggestionDto.weaponId,
      },
    });
  }
}
