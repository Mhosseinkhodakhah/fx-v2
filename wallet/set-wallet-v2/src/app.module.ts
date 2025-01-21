import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WalletModule } from './wallet/wallet.module';
import { ConfigModule } from '@nestjs/config';
import { TransActionModule } from './trans-action/trans-action.module';
import { MongooseModule } from '@nestjs/mongoose';
import { WalletSchema } from './wallet/entities/wallet.entity';
import { TransAction } from './trans-action/entities/trans-action.entity';
import { Withdraw } from './wallet/entities/withdraw.entity';
import { auth } from './auth/auth.middleware';
import { WalletController } from './wallet/wallet.controller';
import { RabbitMqService } from './rabbit-mq/rabbit-mq.service';


@Module({
  imports: [WalletModule, ConfigModule.forRoot({ envFilePath: 'config.env', isGlobal: true }),
    MongooseModule.forRoot('mongodb+srv://kianlucifer0098:lucifer25255225@cluster0.p5b71z1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'),
    MongooseModule.forFeature([{ name: 'wallet', schema: WalletSchema }, { name: 'transAction', schema: TransAction }, { name: 'withdraw', schema: Withdraw }]),
    TransActionModule,
  ],
  controllers: [AppController],
  providers: [AppService, RabbitMqService],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(auth).forRoutes(WalletController)
  }
}
