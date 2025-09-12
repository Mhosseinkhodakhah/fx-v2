import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { SocektService } from './socekt.service';
import { CreateSocektDto } from './dto/create-socekt.dto';
import { UpdateSocektDto } from './dto/update-socekt.dto';
import { Socket } from 'socket.io';
import { InterconnectionService } from 'src/interconnection/interconnection.service';
import { InjectModel } from '@nestjs/mongoose';
import { signalInterFace } from 'src/signal/entities/signal.entity';
import { Model } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';



@WebSocketGateway({ cors: true })
@WebSocketGateway()
export class SocektGateway {
  @WebSocketServer() private server: Socket;
  private readonly queryService : InterconnectionService
  constructor(private readonly socektService: SocektService,
    @InjectModel('signal') private signalModel : Model<signalInterFace>
  ) {}
  
  
  /**
   * when user connected to server we cache the user detail here
   * @param socket 
   */
  handleConnection(socket: Socket): void {
    this.socektService.handleConnection(socket);
  }


  /**
   * collect and emit all signals for every user based on user's leaders
   * @param client 
   * @param payload 
   * @returns 
   */
  @SubscribeMessage('getAllSignals')
  async getAll(client : Socket , payload : any){
    return this.socektService.getAllSignals(client , payload)
  }


  /**
   * emit the price of the every crypto that sent by user in payload
   * @param client 
   * @param payload 
   * @returns 
   */
  @SubscribeMessage('price')
  async chartPrice(client: Socket, payload: any) {
    return this.socektService.priceConnection(client , payload)
  }


  @SubscribeMessage('currencies')
  async getAllCurrencies(client: Socket, payload: any){
    console.log('this is fucking client' , client , payload)
    return this.socektService.getAllData(client , payload)
  }


  /**
   * make the homepage data for user after comming to home page
   * @param client 
   * @param payload 
   * @returns 
   */
  @SubscribeMessage('homePage')
  async homePage(client: Socket, payload: any) {
      return this.socektService.homePageConnection(client , payload)
  }


  @Cron(CronExpression.EVERY_30_MINUTES)
  async checkTheSignals() {
    return this.socektService.emitNewData()
  }
  
}
