import { PartialType } from '@nestjs/mapped-types';
import { CreateSocektDto } from './create-socekt.dto';

export class UpdateSocektDto extends PartialType(CreateSocektDto) {
  id: number;
}
