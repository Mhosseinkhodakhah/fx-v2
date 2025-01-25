import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { taskModel } from './entities/task.entity';


@Module({
  imports : [
    MongooseModule.forRoot(`${process.env.MONGO_CONNECTION_STRING}`),
    MongooseModule.forFeature([{name : 'task' , schema : taskModel}])],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
