import { Module } from '@nestjs/common';
import { SocektService } from './socekt.service';
import { SocektGateway } from './socekt.gateway';
import { CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager';
import { SignalSchema } from 'src/signal/entities/signal.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports:[CacheModule.register(),
    MongooseModule.forRoot(process.env.MONGODBCONNECTIONURL || 'mongodb://localhost:27017/fx'),
    MongooseModule.forFeature([{ name: 'signal', schema: SignalSchema }])
  ],
  providers: [SocektGateway, SocektService ],
})
export class SocektModule {}
