import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { taskInterface } from './entities/task.entity';
import { RabbitMqService } from 'src/rabbit-mq/rabbit-mq.service';

@Injectable()
export class TaskService {


  constructor(@InjectModel('task') private taskModel: Model<taskInterface>,
    private readonly eventService: RabbitMqService,
  ) {}



  async createTask(req: any, res: any, body: CreateTaskDto) {
    try {
      const newTask = await this.taskModel.create(body)
      let queryData = {...newTask.toObject() , mainId : newTask._id.toString()}
      delete queryData._id;
      await this.eventService.updateTask(queryData.mainId , queryData , 'create')
      return {
        message: 'create new task done',
        statusCode: 200,
        data: newTask
      }
    } catch (error) {
      return {
        message: 'create new task failed',
        statusCode: 500,
        error: `${error}`
      }
    }
  }



  async doneTask(req: any, res: any, taskId: string) {
    try {
      const userId = req.user._id;
      const task = await this.taskModel.findById(taskId)
      if (!task) {
        return {
          message: 'make done task failed',
          error: 'this task is not exist on database',
          statusCode: 404
        }
      }
      // send message to user for increasing point
      await this.eventService.increasePoint(userId, task.points)
      task.Completed.push(userId)
      await task.save()
      // update the query service 
      let updated = await this.taskModel.findById(taskId)
      let queryData = {...updated.toObject() , mainId : updated._id.toString()}
      delete queryData._id;
      await this.eventService.updateTask(queryData.mainId , queryData , 'create')
      //finish
      return {
        message: 'make done task done',
        statusCode: 200,
        data: task
      }
    } catch (error) {
      return {
        message: 'make done task failed',
        statusCode: 500,
        error: `${error}`
      }
    }
  }



  async updateTask(req: any, res: any, taskId: string, body: CreateTaskDto) {
    try {
      const taskUpdate = await this.taskModel.findByIdAndUpdate(taskId, body)
      const updated = await this.taskModel.findById(taskId)
      //update the query service
      let queryData = {...updated.toObject() , mainId : updated._id.toString()}
      delete queryData._id;
      await this.eventService.updateTask(queryData.mainId , queryData , 'create')
      return {
        message: 'update the task done',
        statusCode: 200,
        data: updated
      }
    } catch (error) {
      return {
        message: 'update task failed',
        statusCode: 500,
        error: `${error}`
      }
    }
  }



  async deleteTask(req: any, res: any, taskId: string) {
    try {
      const task = await this.taskModel.findById(taskId)
      // just define the delete event first
      if (!task) {
        return {
          message: 'delete task failed',
          statusCode: 404,
          error: 'this task is not defined yet.'
        }
      }
      await task.deleteOne()
      return {
        message: 'delete task done',
        statusCode: 200,
      }
    } catch (error) {
      return {
        message: 'delete task failed',
        statusCode: 500,
        error: `${error}`
      }
    }
  }

}
