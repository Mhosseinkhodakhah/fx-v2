import { Injectable } from '@nestjs/common';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { Channel } from 'amqplib';
import { updateTaskInterface } from 'src/interfaces/interfaces.interface';
import { CreateTaskDto } from 'src/task/dto/create-task.dto';

@Injectable()
export class RabbitMqService {
    private channelWrapper : ChannelWrapper;
    constructor(){
        const connection = amqp.connect(['amqp://localhost'])
        this.channelWrapper = connection.createChannel({
            setup:(channel : Channel)=>{
                channel.assertQueue('taskService' , {durable : true})
            }
        })
    }


    async updateTask(mainId : string , task : CreateTaskDto , message : string) : Promise<void>{
        let data : updateTaskInterface = {mainId : mainId , task : task , message : message}
        await this.channelWrapper.sendToQueue('taskService' , 
            Buffer.from(JSON.stringify(data))
        )
        console.log('event sent for query service to update the data')
    }


    async increasePoint(userId : string , point : number){
        let data = {userId , point}
        await this.channelWrapper.sendToQueue(
            'userPoint',
            Buffer.from(JSON.stringify(data))
        )
    }



}
