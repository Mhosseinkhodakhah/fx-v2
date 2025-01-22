import { Module } from '@nestjs/common';
import { SignalService } from './signal.service';
import { SignalController } from './signal.controller';
import { SignalSchema } from './entities/signal.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { SocektService } from 'src/socekt/socekt.service';

@Module({
  imports:[ MongooseModule.forRoot('mongodb+srv://kianlucifer0098:lucifer25255225@cluster0.p5b71z1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'),
      MongooseModule.forFeature([{ name: 'signal', schema: SignalSchema }])],
  controllers: [SignalController],
  providers: [SignalService , SocektService],
})
export class SignalModule {}
