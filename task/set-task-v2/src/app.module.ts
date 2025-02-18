import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskModule } from './task/task.module';
import { ConfigService, ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose';
import { taskModel } from './task/entities/task.entity';
import { auth } from './auth/auth.middleware';
import { TaskController } from './task/task.controller';
import { RabbitMqService } from './rabbit-mq/rabbit-mq.service';


@Module({
  imports: [TaskModule,
    ConfigModule.forRoot({ envFilePath: 'config.env', isGlobal: true }),
    MongooseModule.forRoot('mongodb+srv://kianlucifer0098:lucifer25255225@cluster0.p5b71z1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'),
    MongooseModule.forFeature([{ name: 'task', schema: taskModel }])
  ],
  controllers: [AppController],
  providers: [AppService, RabbitMqService],
})


export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(auth).forRoutes(TaskController)
  }
}