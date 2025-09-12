import { Module } from '@nestjs/common';
import { SignalService } from './signal.service';
import { SignalController } from './signal.controller';
import { SignalSchema } from './entities/signal.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { SocektService } from 'src/socekt/socekt.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports:[CacheModule.register(),MongooseModule.forRoot(process.env.MONGODBCONNECTIONURL || 'mongodb://localhost:27017/fx'),
      MongooseModule.forFeature([{ name: 'signal', schema: SignalSchema }])],
  controllers: [SignalController],
  providers: [SignalService , SocektService ],
})
export class SignalModule {}
