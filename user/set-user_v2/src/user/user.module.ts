import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './entities/user.entity';
import { subScribers } from './entities/subscribers.entity';
import { TokenService } from 'src/token/token.service';
import { EmailService } from 'src/email/email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { InterconnectionService } from 'src/interconnection/interconnection.service';
import { MulterModule } from '@nestjs/platform-express';
import { RabbitMqService } from 'src/rabbit-mq/rabbit-mq.service';

@Module({
  imports : [
    MulterModule.register({ dest: '/home/uploadedFiles' }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'kianlucifer0098@gmail.com',
          pass: 'cnno pezo wooi qkpl',
        },
      },
    })
    , MongooseModule.forRoot('mongodb+srv://kianlucifer0098:lucifer25255225@cluster0.p5b71z1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'),MongooseModule.forFeature([{ name: 'user', schema: UserSchema }, { name: 'subscribers', schema: subScribers }])],
  controllers: [UserController],
  providers: [UserService , TokenService , EmailService , InterconnectionService , RabbitMqService],
})
export class UserModule {}
