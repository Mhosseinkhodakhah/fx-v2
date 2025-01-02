import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './entities/user.entity';
import { subScribers } from './entities/subscribers.entity';
import { TokenService } from 'src/token/token.service';

@Module({
  imports : [MongooseModule.forRoot('mongodb+srv://kianlucifer0098:lucifer25255225@cluster0.p5b71z1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'),MongooseModule.forFeature([{ name: 'user', schema: UserSchema }, { name: 'subscribers', schema: subScribers }])],
  controllers: [UserController],
  providers: [UserService , TokenService],
})
export class UserModule {}
