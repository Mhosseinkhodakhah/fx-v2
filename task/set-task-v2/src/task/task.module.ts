import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { taskModel } from './entities/task.entity';
import { RabbitMqService } from 'src/rabbit-mq/rabbit-mq.service';


@Module({
  imports : [
    MongooseModule.forRoot('mongodb+srv://kianlucifer0098:lucifer25255225@cluster0.p5b71z1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'),
    MongooseModule.forFeature([{name : 'task' , schema : taskModel}])],
  controllers: [TaskController],
  providers: [TaskService , RabbitMqService],
})
export class TaskModule {}
