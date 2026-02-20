import { PartialType } from '@nestjs/swagger';
import { CreateNailOptionDto } from './create-nail-option.dto';

export class UpdateNailOptionDto extends PartialType(CreateNailOptionDto) {}
