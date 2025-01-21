import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TransActionService } from './trans-action.service';
import { CreateTransActionDto } from './dto/create-trans-action.dto';
import { UpdateTransActionDto } from './dto/update-trans-action.dto';

@Controller('trans-action')
export class TransActionController {
  constructor(private readonly transActionService: TransActionService) {}

  @Post()
  create(@Body() createTransActionDto: CreateTransActionDto) {
    return this.transActionService.create(createTransActionDto);
  }

  @Get()
  findAll() {
    return this.transActionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transActionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTransActionDto: UpdateTransActionDto) {
    return this.transActionService.update(+id, updateTransActionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transActionService.remove(+id);
  }
}
