import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './entities/user.entity';
import { subScribers } from './entities/subscribers.entity';
import { transAction, TransActionSchema } from 'src/wallet/entities/trans-action.entity';

@Module({
  imports:[
    MongooseModule.forRoot('mongodb+srv://kianlucifer0098:lucifer25255225@cluster0.p5b71z1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0') ,MongooseModule.forFeature([{ name: 'user', schema: UserSchema }, { name: 'transAction', schema: TransActionSchema } , { name: 'subscribers', schema: subScribers }])
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
