import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from './user/entities/user.entity';
import { subScribers } from './user/entities/subscribers.entity';
import { auth } from './auth/auth.middleware';
import { ConfigService, ConfigModule } from '@nestjs/config'
import { TokenService } from './token/token.service';
import { EmailService } from './email/email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { InterconnectionService } from './interconnection/interconnection.service';
import { MulterModule } from '@nestjs/platform-express';
import { RabbitMqService } from './rabbit-mq/rabbit-mq.service';
import { UserController } from './user/user.controller';
import { APP_GUARD } from '@nestjs/core';
import { RoleGaurdGuard } from './role-gaurd/role-gaurd.guard';

@Module({
  imports: [UserModule ,
    MulterModule.register({dest : '/home/uploadedFiles'}),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: true,
        auth: {
          user: 'kianlucifer0098@gmail.com',
          pass: 'cnno pezo wooi qkpl',
        },
      },
    })
    ,MongooseModule.forRoot('mongodb://localhost:27017/fx') ,
    MongooseModule.forFeature([{ name: 'user', schema: UserSchema }, { name: 'subscribers', schema: subScribers }]) , 
    ConfigModule.forRoot({ envFilePath: 'config.env', isGlobal: true }) , 
    ],
  controllers: [AppController],
  providers: [AppService, TokenService, EmailService, InterconnectionService, RabbitMqService , 
    {
      provide: APP_GUARD,
      useClass: RoleGaurdGuard,
    }
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(auth).forRoutes(UserController),
    consumer.apply(auth).exclude({path : 'auth/register' , method : RequestMethod.POST} , 
      {path : 'auth/otp/check/:code/:email' , method : RequestMethod.PATCH},
    {path : 'auth/login' , method : RequestMethod.POST},
    {path : '/home/info' , method : RequestMethod.GET}
    ).forRoutes(UserController)
  }
}
