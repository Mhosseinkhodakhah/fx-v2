import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from './user/entities/user.entity';
import { subScribers } from './user/entities/subscribers.entity';
import { auth } from './auth/auth.middleware';
import { ConfigService, ConfigModule } from '@nestjs/config'

@Module({
  imports: [UserModule , MongooseModule.forRoot('mongodb+srv://kianlucifer0098:lucifer25255225@cluster0.p5b71z1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0') ,MongooseModule.forFeature([{ name: 'user', schema: UserSchema }, { name: 'subscribers', schema: subScribers }]) , ConfigModule.forRoot({ envFilePath: 'config.env', isGlobal: true })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(auth).forRoutes({path : '/user/info' , method : RequestMethod.GET})
  }
}
