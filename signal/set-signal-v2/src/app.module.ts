import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocektModule } from './socekt/socekt.module';
import { InterconnectionService } from './interconnection/interconnection.service';
import { SignalModule } from './signal/signal.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SignalSchema } from './signal/entities/signal.entity';
import { RabbitMqService } from './rabbit-mq/rabbit-mq.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [SocektModule, SignalModule,
    CacheModule.register(),
    MongooseModule.forRoot('mongodb+srv://kianlucifer0098:lucifer25255225@cluster0.p5b71z1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'),
    MongooseModule.forFeature([{ name: 'signal', schema: SignalSchema }]),
    SignalModule],  
  
  controllers: [AppController],
  providers: [AppService, InterconnectionService, RabbitMqService],
})
export class AppModule {}
