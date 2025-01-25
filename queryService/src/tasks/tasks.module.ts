import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { taskModel } from './entities/task.entity';

@Module({
  imports : [MongooseModule.forRoot('mongodb+srv://kianlucifer0098:lucifer25255225@cluster0.p5b71z1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'),
    MongooseModule.forFeature([{name : 'task' , schema : taskModel}])
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
