import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { Withdraw } from './entities/withdraw.entity';
import { TransAction } from './entities/trans-action.entity';
import { WalletSchema } from './entities/wallet.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports:[MongooseModule.forRoot('mongodb+srv://kianlucifer0098:lucifer25255225@cluster0.p5b71z1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'),
    MongooseModule.forFeature([{ name: 'wallet', schema: WalletSchema }, { name: 'transAction', schema: TransAction }, { name: 'withdraw', schema: Withdraw }])],
  controllers: [WalletController],
  providers: [WalletService],
})
export class WalletModule {}
