import { PartialType } from '@nestjs/swagger';
import { CreateCardDto } from '../create-card.dto/create-card.dto';

export class UpdateCardDto extends PartialType(CreateCardDto) {}
