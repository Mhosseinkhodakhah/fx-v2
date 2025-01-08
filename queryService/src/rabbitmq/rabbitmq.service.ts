import { Inject, Injectable } from '@nestjs/common';
import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { Channel } from 'amqplib';
import { ConfirmChannel } from 'amqplib';
import { Model } from 'mongoose';
import { updateUserDBInterface, updateWalletDataInterface } from 'src/interfaces/interfaces.interface';
import { userInterFace } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';


@Injectable()
export class RabbitMqService {
    // constructor(private readonly amqpConnection: AmqpConnection) {}            // get amqpConnection in constructor
    private channelWrapper: ChannelWrapper;         // make the channel wrapper
    constructor(@InjectModel('user') private userModel : Model<userInterFace>  ) {
        const connection = amqp.connect(['amqp://localhost']);     // connect to rabbit
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////!
        //*its for assert the queues
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////!
        this.channelWrapper = connection.createChannel({             // crathe the channel
            setup: (channel: Channel) => {                                    // setup the channel
                channel.assertQueue('updateUserData', { durable: true });          // assert the queue
                channel.assertQueue('updateSignalData', { durable: true });          // assert the queue
                channel.assertQueue('updateWalletData', { durable: true });          // assert the queue
                channel.assertQueue('updateTaskData', { durable: true });          // assert the queue
                channel.assertQueue('updateStoryData', { durable: true });          // assert the queue
            },
        });

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////!
        //*its for when the other services want user data
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////!

        this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {          // add setup for channel
            // await channel.assertQueue('signal', { durable: true });                    // assert the queu
            await channel.consume('updateUserData', async (message : any) => {
                const data: updateUserDBInterface = JSON.parse(message.content.toString())
                const user=await this.userModel.findById(data.userId)
                if (user){
                    let newData = {...user.toObject() , ...data.userData}
                    await user.updateOne(newData)
                }else{
                    await this.userModel.create(data.userData)
                }
                channel.ack(message);
            })

            await channel.consume('updateSignalData', async (message) => {
                const data: updateUserDBInterface = JSON.parse(message.content.toString())
                channel.ack(message);
            })


            await channel.consume('updateWalletData', async (message) => {
                const data: updateWalletDataInterface = JSON.parse(message.content.toString())
                
                channel.ack(message);
            })


            await channel.consume('updateTaskData', async (message) => {
                const data: updateUserDBInterface = JSON.parse(message.content.toString())
                channel.ack(message);
            })


            await channel.consume('updateStoryData', async (message) => {
                const data: updateUserDBInterface = JSON.parse(message.content.toString())
                channel.ack(message);
            })
        })

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////!
        //*its for when the other services want usersLeader datas
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////!

        // this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {          // add setup for channel
        //   // await channel.assertQueue('signal', { durable: true });                    // assert the queu
        //   channel.consume('getUserLeaders',async (message) => {
        //     const userId = JSON.parse(message.content.toString())
        //     console.log('data sent for signal ... ', userId)
        //     channel.ack(message);
        //     const userData = await this.userModel.findById(userId).select(['username' , 'profile' , 'role'])
        //     // const leaders = userData.leaders

        //     const allLeaders = await this.userModel.find({$and : [{ role: 3 } , {'subScriber.userId' : {$in : [userId]}}]}).select(["username" , 'profile'])
        //     console.log('sent user data ...')
        //     if (userData.role == 3){
        //       allLeaders.push(userData)
        //     }
        //     // await channel.reply_to('getUserLeaders' , Buffer.from(JSON.stringify({ allLeaders : allLeaders })))
        //     await channel.sendToQueue(
        //       'ResForGetUserLeaders',
        //       Buffer.from(JSON.stringify({ allLeaders : allLeaders })),
        //     );
        //   })
        // })
    }

    
}
