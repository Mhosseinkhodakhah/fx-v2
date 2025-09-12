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
import { CurrenciesService } from './currencies/currencies.service';
import { ConfigService, ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [SocektModule, SignalModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    CacheModule.register(),
    MongooseModule.forRoot(process.env.MONGODBCONNECTIONURL || 'mongodb://localhost:27017/fx'),
    MongooseModule.forFeature([{ name: 'signal', schema: SignalSchema }]),
    SignalModule],  
  
  controllers: [AppController],
  providers: [AppService, InterconnectionService, RabbitMqService, CurrenciesService],
})
export class AppModule {}
