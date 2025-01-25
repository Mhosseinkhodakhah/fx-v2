import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, Put } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}


  @Post('/create')
  createNewTask(@Req() req: any, @Res() res: any, @Body() body: CreateTaskDto) {
    return this.taskService.createTask(req, res, body)
  }
 @Patch('/done/:taskId')
  doneTask(@Req() req: any, @Res() res: any, @Param('taskId') taskId: string) {
    return this.taskService.doneTask(req, res, taskId)
  }

 @Put('/update/:taskId')
  update(@Req() req: any, @Res() res: any, @Param('taskId') taskId: string, @Body() body: CreateTaskDto) {
    return this.taskService.updateTask(req, res, taskId, body)
  }

  @Delete('/delete/:taskId')
  deleteTask(@Req() req: any, @Res() res: any, @Param('taskId') taskId: string) {
    return this.taskService.deleteTask(req, res, taskId)
  }


}
