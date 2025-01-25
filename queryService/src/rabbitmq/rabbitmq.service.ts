import { Inject, Injectable} from '@nestjs/common';
import { HttpException, HttpStatus, Logger} from '@nestjs/common';
import { InjectModel} from '@nestjs/mongoose';
import amqp, { ChannelWrapper} from 'amqp-connection-manager';
import { Channel} from 'amqplib';
import { ConfirmChannel} from 'amqplib';
import { Model} from 'mongoose';
import { updateStoryInterface, updateTaskInterface, updateUserDBInterface, updateWalletDataInterface } from 'src/interfaces/interfaces.interface';
import { signalInterFace} from 'src/signal/entities/signal.entity';
import { storyInterface} from 'src/story/entities/story.entity';
import { taskInterface} from 'src/tasks/entities/task.entity';
import { userInterFace} from 'src/user/entities/user.entity';
import { walletInterFace} from 'src/wallet/entities/wallet.entity';






@Injectable()
export class RabbitMqService {
    // constructor(private readonly amqpConnection: AmqpConnection) {}            // get amqpConnection in constructor
    private channelWrapper: ChannelWrapper;         // make the channel wrapper
    constructor(@InjectModel('user') private userModel: Model<userInterFace>,
        @InjectModel('wallet') private wallet: Model<walletInterFace>,
        @InjectModel('story') private storyModel: Model<storyInterface>,
        @InjectModel('task') private taskModel : Model<taskInterface>,
        @InjectModel('signal') private signalModel : Model<signalInterFace>
    ) {
        const connection = amqp.connect(['amqp://localhost']);    // connect to rabbit
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////!
        // its for assert the queues
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////!
        this.channelWrapper = connection.createChannel({             // crathe the channel
            setup: (channel: Channel) => {                                    // setup the channel
                channel.assertQueue('userService', { durable: true });          // assert the queue
                channel.assertQueue('signalService', { durable: true });          // assert the queue
                channel.assertQueue('walletService', { durable: true });          // assert the queue
                channel.assertQueue('taskService', { durable: true });          // assert the queue
                channel.assertQueue('storyService', { durable: true });          // assert the queue
            },
        });

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////!
        //*its for when the other services want user data
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////!

        this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {          // add setup for channel
            await channel.consume('userService', async (message: any) => {
                try {
                    const data: updateUserDBInterface = JSON.parse(message.content.toString())
                    switch (data.message) {
                        case 'updateUser':
                            const user = await this.userModel.findOne({ email: data.userEmail })
                            let newData = { ...user.toObject(), ...data.userData }
                            await user.updateOne(newData)
                            break;

                        case 'createNewUser':
                            await this.userModel.create(data.userData)
                            break;

                        default:
                            break;
                    }
                    channel.ack(message);
                } catch (error) {
                    console.log('error occured in updating user database . . .====>>>>>', error)
                }
            })


            await channel.consume('signalService', async (message) => {
                const data: updateUserDBInterface = JSON.parse(message.content.toString())
                channel.ack(message);
            })


            await channel.consume('walletService', async (message) => {
                const data: updateWalletDataInterface = JSON.parse(message.content.toString())
                try {
                    switch (data.message) {
                        case 'createNewWallet':
                            await this.wallet.create(data.data)
                            break;

                        default:
                            break;
                    }
                    channel.ack(message);
                } catch (error) {
                    console.log('something went wrong while doing', data.message, `${error}`)
                }
            })


            await channel.consume('taskService', async (message) => {
                const data: updateTaskInterface = JSON.parse(message.content.toString())
                try {
                    switch (data.message) {
                        case 'create':
                            await this.taskModel.create(data.task)
                            break;
                        case 'update':
                            let task = await this.taskModel.findOne({mainId : data.mainId})
                            let newData = {...task.toObject() , ...task}
                            await task.updateOne(newData)
                            break;
                        default:
                            break;
                        }
                        channel.ack(message);
                } catch (error) {
                    console.log('error occured while doing task service >>>>' , `${error}`)
                }
            })


            await channel.consume('storyService', async (message:any) => {
                const data: updateStoryInterface = JSON.parse(message.content.toString())
                try {
                    switch (data.message) {
                        case 'create':
                            await this.storyModel.create(data.story)
                            break;
                        case 'update':
                            let story = await this.storyModel.findOne({mainId : data.mainId})
                            let newData = {...story.toObject() , ...data.story}
                            await story.updateOne(newData)
                        default:
                            console.log('message undefined>>>>' , data.message)
                            break;
                    }
                    channel.ack(message);
                } catch (error) {
                    console.log('error occured in story service queue' , `${error}`)
                }
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
