import { Injectable } from '@nestjs/common';
import { CreateSignalDto } from './dto/create-signal.dto';
import { UpdateSignalDto } from './dto/update-signal.dto';
import { SocektService } from 'src/socekt/socekt.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { signalInterFace } from './entities/signal.entity';
import { Photos } from 'src/photos/photos';
import { RabbitMqService } from 'src/rabbit-mq/rabbit-mq.service';

@Injectable()
export class SignalService {
  private readonly socketService: SocektService;
  private readonly eventService : RabbitMqService
  @InjectModel('signal') private signalModel : Model<signalInterFace>


  async createSignal(req:any, res:any, body : CreateSignalDto) {
    if (req.user.role != 3) {
      return {
        message : 'add signal failed! this account is not leader!',
        error : 'forbidden user!',
        statusCode : 403
      }
    }
    // console.log(req.user)
    const number = await this.signalModel.find({ signalType: 'vip' })
    body.signalName = `VipSignal ${number.length}`
    body.signalType = 'vip'
    body.leader = { id: req.user._id, username: req.user.username, pictureProfile: req.user?.profile }
    const currency1 = body.symbol.split('-')[0]
    const currency2 = body.symbol.split('-')[1]
    body.firstLogo = new Photos().logos[currency1]
    body.secondLogo = new Photos().logos[currency2]
    const resault = await this.signalModel.create(body)
    await this.socketService.refreshSignals(req.user._id)    
    await this.eventService.updateSignal(body.signalName , body , 'create')
    // await this.f('add', resault)        its for calling tracer for trace the signals . . .
    return {
      message : 'add new signal done',
      statusCode : 200,
      data : resault
    }
  }


  async createFreeSignal(req:any, res:any, body:CreateSignalDto) {
    
    console.log(req.user)
    const number = await this.signalModel.find({ signalType: 'free' })
    body.signalName = `FreeSignal ${number.length}`
    body.signalType = 'free'
    body.leader = { id: req.user._id, username: req.user.username, pictureProfile: req.user?.profile }
    const currency1 = body.symbol.split('-')[0]
    const currency2 = body.symbol.split('-')[1]
    body.firstLogo = new Photos().logos[currency1]
    body.secondLogo = new Photos().logos[currency2]
    console.log('ssssssss', body)
    console.log(currency2)
    const signal = await this.signalModel.create(body)
    // await this.f('add', signal)
    await this.socketService.refreshSignals(req.user._id)
    await this.eventService.updateSignal(body.signalName , body , 'create')
    return {
      message : 'add free signal done!',
      statusCode : 200,
      data:signal
    }
  }


///////////////////////////////////////||||||||||||||||||||||||
}
