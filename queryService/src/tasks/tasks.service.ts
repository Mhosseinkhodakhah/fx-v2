import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { taskInterface } from './entities/task.entity';

@Injectable()
export class TasksService {
  
  constructor(@InjectModel('task') private taskModel : Model<taskInterface>){}


  async getAllTasks(req : any , res : any){
    try {
      let userId : string = req.user._id;
      const allDoneTasks = await this.taskModel.find({Completed : {$in : userId}})
      const allTasks = await this.taskModel.find({Completed : {$ne : userId}})
      return {
        message : 'get all task done',
        statusCode : 200,
        data : {done : allDoneTasks , allTasks : allTasks}
      }
    } catch (error) {
      return {
        message : 'get all task failed',
        statusCode : 500,
        error : `${error}`
      }
    }
  }
  
}
