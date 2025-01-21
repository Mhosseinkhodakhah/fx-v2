import { Injectable } from '@nestjs/common';
import { CreateTransActionDto } from './dto/create-trans-action.dto';
import { UpdateTransActionDto } from './dto/update-trans-action.dto';

@Injectable()
export class TransActionService {
  create(createTransActionDto: CreateTransActionDto) {
    return 'This action adds a new transAction';
  }

  findAll() {
    return `This action returns all transAction`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transAction`;
  }

  update(id: number, updateTransActionDto: UpdateTransActionDto) {
    return `This action updates a #${id} transAction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transAction`;
  }
}
