import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RabbitMqService } from './rabbitmq/rabbitmq.service';
import { UserModule } from './user/user.module';
import { WalletModule } from './wallet/wallet.module';
import { SignalModule } from './signal/signal.module';
import { StoryModule } from './story/story.module';
import { TasksModule } from './tasks/tasks.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user/entities/user.entity';
import { subScribers } from './user/entities/subscribers.entity';
import { ConfigService, ConfigModule } from '@nestjs/config'
import { TransAction, transAction } from './wallet/entities/trans-action.entity';
import { storySchema } from './story/entities/story.entity';
import { taskModel } from './tasks/entities/task.entity';
import { WalletSchema } from './wallet/entities/wallet.entity';
import { SignalSchema } from './signal/entities/signal.entity';
import { Withdraw } from './wallet/entities/withdraw.entity';

@Module({
  imports: [MongooseModule.forRoot('mongodb+srv://kianlucifer0098:lucifer25255225@cluster0.p5b71z1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'),
  MongooseModule.forFeature([
      { name: 'user', schema: UserSchema },
    { name: 'transAction', schema: TransAction },
    { name: 'story', schema: storySchema },
    { name: 'task', schema: taskModel },
    { name: 'wallet', schema: WalletSchema },
    { name: 'subscribers', schema: subScribers },
    { name: 'signal', schema: SignalSchema },
    { name: 'withdraw', schema: Withdraw }
    ]),
  ConfigModule.forRoot({ envFilePath: 'config.env', isGlobal: true })
    , UserModule, WalletModule, SignalModule, StoryModule, TasksModule],
  controllers: [AppController],
  providers: [AppService, RabbitMqService],
})

export class AppModule { }
