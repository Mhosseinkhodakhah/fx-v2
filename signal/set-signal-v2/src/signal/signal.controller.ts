import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Req, Res, ValidationPipe } from '@nestjs/common';
import { SignalService } from './signal.service';
import { CreateSignalDto } from './dto/create-signal.dto';
import { UpdateSignalDto } from './dto/update-signal.dto';

@Controller('signal')
export class SignalController {
  constructor(private readonly signalService: SignalService) {}

  @Post('signal/vip')
  create(@Res() res : any ,  @Req() req : any , @Body(new ValidationPipe()) body : CreateSignalDto){
    return this.signalService.createSignal(req , res , body)
  }


  @Post('signal/free')
  createFreeSignal(@Res() res : any ,  @Req() req : any , @Body(new ValidationPipe()) body : any){
    return this.signalService.createFreeSignal(req , res , body)
  }


  // @Patch('updateSignal/:signalId')




  // @Put('closeSignal/:signalId')




  // @Patch('expireSignal/:id')


}
