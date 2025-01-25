import { Module } from '@nestjs/common';
import { SocektService } from './socekt.service';
import { SocektGateway } from './socekt.gateway';
import { CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager';
import { SignalSchema } from 'src/signal/entities/signal.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports:[CacheModule.register(),
    MongooseModule.forRoot('mongodb+srv://kianlucifer0098:lucifer25255225@cluster0.p5b71z1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'),
    MongooseModule.forFeature([{ name: 'signal', schema: SignalSchema }])
  ],
  providers: [SocektGateway, SocektService ],
})
export class SocektModule {}
