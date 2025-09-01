import { Body, Controller, Post } from '@nestjs/common';
import { SuggestionService } from './suggestion.service';
import { CreateSuggestionDto } from './dto/create-suggestion.dto';

@Controller('suggestion')
export class SuggestionController {
  constructor(private readonly suggestionService: SuggestionService) {}

  @Post('create')
  async create(@Body() createSuggestionDto: CreateSuggestionDto) {
    return await this.suggestionService.create(createSuggestionDto);
  }
}
