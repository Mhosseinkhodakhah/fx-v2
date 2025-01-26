import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './entities/user.entity';
import { subScribers } from './entities/subscribers.entity';
import { TransAction } from 'src/wallet/entities/trans-action.entity';
import { RabbitMqService } from 'src/rabbitmq/rabbitmq.service';
import { wallet, WalletSchema } from 'src/wallet/entities/wallet.entity';
import { storySchema } from 'src/story/entities/story.entity';
import { taskModel } from 'src/tasks/entities/task.entity';
import { SignalSchema } from 'src/signal/entities/signal.entity';
import { RedisHandlerService } from 'src/redis-handler/redis-handler.service';

@Module({
  imports:[
    MongooseModule.forRoot('mongodb+srv://kianlucifer:Lucifer25255225@cluster0.kcuqf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0') ,MongooseModule.forFeature([{ name: 'user', schema: UserSchema }, 
    {name: 'transAction', schema: TransAction },
    {name : 'story' , schema : storySchema},
    {name : 'task' , schema : taskModel},
    {name : 'wallet' , schema : WalletSchema}, 
    {name: 'subscribers', schema: subScribers},
    {name : 'signal' , schema : SignalSchema}
  ])
  ],
  controllers: [UserController],
  providers: [UserService , RabbitMqService , RedisHandlerService],
})
export class UserModule {}
