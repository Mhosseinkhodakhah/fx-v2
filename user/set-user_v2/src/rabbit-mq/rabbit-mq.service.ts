import { Inject, Injectable } from '@nestjs/common';
import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { Channel , ConfirmChannel} from 'amqplib';
import { Model } from 'mongoose';
import { payerInterface, walletCreationData } from 'src/interfaces/interfaces.interface';
import { userInterFace } from 'src/user/entities/user.entity';


@Injectable()
export class RabbitMqService {
    private channelWrapper: ChannelWrapper;         // make the channel wrapper
    constructor(@InjectModel('user') private userModel : Model<userInterFace>) {
        const connection = amqp.connect(['amqp://localhost']);     // connect to rabbit
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////!
        //*its for assert the queues
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////!
        this.channelWrapper = connection.createChannel({             // crathe the channel
            setup: (channel: Channel) => {                                   // setup the channel
                channel.assertQueue('userService', { durable: true });          // assert the queue
                channel.assertQueue('createWallet', { durable: true });          // assert the queue for create wallet from user service
                channel.assertQueue('payToLeader' , {durable : true});           // pay to leader after subscribing him
                channel.assertQueue('userPoint' , {durable : true});            // a queue for update the user point
            },
        });

        /**
         * while the task service want to update the user point
         */
        this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {          // add setup for channel
          await channel.consume('userPoint', async (message : any) => {
            const data : {userId : string , point : number} = JSON.parse(message.content.toString())
            console.log('data sent for signal ... ', data.userId)
            const userData = await this.userModel.findById(data.userId)
            if (userData){
                userData.points += data.point
                await userData.save()
                console.log('user point updated successfully')
            }
            channel.ack(message);
          })
        })
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////!
    //*its for updating the user data in query service
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////!
    async updateUser(userEmail: string, userData: {} , message : string) {                // send the message in queue
        try {
            let data = { userEmail: userEmail, data: userData , message : message }
            await this.channelWrapper.sendToQueue(
                'userService',
                Buffer.from(JSON.stringify(data)),
            );
        } catch (error) {
            console.log('error occured whent trying to send to increase point user')
            console.log(`${error}`)
        }
    }


    /////////////////////////////////////////////////
    // its for creating wallet after update user
    /////////////////////////////////////////////////
    async createWallet(user : walletCreationData){
        try {
            await this.channelWrapper.sendToQueue(
                'createWallet',
                Buffer.from(JSON.stringify(user))
            );
        } catch (error) {
            console.log('error occured when trying to send wallet for creating wallet')
            console.log(`${error}`)
        }
    }


    async payToLeader(data : payerInterface , type : number){
        try {
            await this.channelWrapper.sendToQueue(
                'payToLeader',
                Buffer.from(JSON.stringify({data : data , type : type}))
            )
            console.log('event send to wallet for pay to leader')
        } catch (error) {
            console.log('something went wrong while sending event to wallet for pay to leader>>>>>>' , `${error}`)
        }
    }
}
