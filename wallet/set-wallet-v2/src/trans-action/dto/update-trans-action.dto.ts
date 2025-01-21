import { PartialType } from '@nestjs/mapped-types';
import { CreateTransActionDto } from './create-trans-action.dto';

export class UpdateTransActionDto extends PartialType(CreateTransActionDto) {}
