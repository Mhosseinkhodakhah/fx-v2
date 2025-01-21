import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { WalletSchema } from './entities/wallet.entity';
import { Withdraw } from './entities/withdraw.entity';
import { TransAction } from 'src/trans-action/entities/trans-action.entity';
import { RabbitMqService } from 'src/rabbit-mq/rabbit-mq.service';


@Module({
  imports :[WalletModule, ConfigModule.forRoot({ envFilePath: 'config.env', isGlobal: true }),
      MongooseModule.forRoot('mongodb+srv://kianlucifer0098:lucifer25255225@cluster0.p5b71z1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'),
      MongooseModule.forFeature([{ name: 'wallet', schema: WalletSchema }, { name: 'transAction', schema: TransAction }, { name: 'withdraw', schema: Withdraw }]),
    ],
  controllers: [WalletController],
  providers: [WalletService , RabbitMqService],
})
export class WalletModule {}
