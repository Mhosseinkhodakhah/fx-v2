import { Inject, Injectable } from '@nestjs/common';
import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { Channel } from 'amqplib';



@Injectable()
export class RabbitMqService {
    // constructor(private readonly amqpConnection: AmqpConnection) {}            // get amqpConnection in constructor
    private channelWrapper: ChannelWrapper;         // make the channel wrapper
    constructor() {
        const connection = amqp.connect(['amqp://localhost']);     // connect to rabbit
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////!
        //*its for assert the queues
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////!
        this.channelWrapper = connection.createChannel({             // crathe the channel
            setup: (channel: Channel) => {                                    // setup the channel
                channel.assertQueue('test', { durable: true });          // assert the queue
            },
        });


        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////!
        //*its for when the other services want user data
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////!

        // this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {          // add setup for channel
        //   // await channel.assertQueue('signal', { durable: true });                    // assert the queu
        //   await channel.consume('getUserData', async (message) => {
        //     const userId = JSON.parse(message.content.toString())
        //     console.log('data sent for signal ... ', userId)
        //     channel.ack(message);
        //     const userData = await this.userModel.findById(userId)
        //     console.log('sent user data ...')
        //     await this.channelWrapper.sendToQueue(
        //       'responseForGetUserData',
        //       Buffer.from(JSON.stringify({ userData: userData })),
        //     );
        //   })
        // })




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




    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////!
    //*its for 
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////!
    async increasePoint(userId: string, point: number) {                  // send the message in queue
        try {
            let data = { user: userId, point: point }
            await this.channelWrapper.sendToQueue(
                'increasePoint',
                Buffer.from(JSON.stringify(data)),
            );
            Logger.log('Sent To user for increase point');
        } catch (error) {
            console.log('error occured whent trying to send to increase point user')
            console.log(`${error}`)
        }
    }

    //   ////////////////////////////////////////////////////////////////////////////////////////////////////////////////!
    //   //*its for send message to wallet for creating wallet
    //   ////////////////////////////////////////////////////////////////////////////////////////////////////////////////!

    //   async createWallet(user: any) {                  // send the message in queue
    //     try {
    //       await this.channelWrapper.sendToQueue(
    //         'createWallet',
    //         Buffer.from(JSON.stringify(user)),
    //       );
    //       Logger.log('create wallet sent to wallet service');
    //     } catch (error) {
    //       throw new HttpException(
    //         'Error adding mail to queue',
    //         HttpStatus.INTERNAL_SERVER_ERROR,
    //       );
    //     }
    //   }

    //   ////////////////////////////////////////////////////////////////////////////////////////////////////////////////!
    //   //*its for send message to wallet for make transAction
    //   ////////////////////////////////////////////////////////////////////////////////////////////////////////////////!

    //   async payToLeader(users, type: number) {                  // send the message in queue
    //     const data = { user1: users.payer, user2: users.reciever, type: type, amount: users.amount }
    //     console.log(users.amount)
    //     try {
    //       await this.channelWrapper.sendToQueue(
    //         'transAction',
    //         Buffer.from(JSON.stringify(data)),
    //       );
    //       Logger.log('transAction to wallet sent to wallet service');
    //     } catch (error) {
    //       throw new HttpException(
    //         'Error adding mail to queue',
    //         HttpStatus.INTERNAL_SERVER_ERROR,
    //       );
    //     }
    //   }



    //   ////////////////////////////////////////////////////////////////////////////////////////////////////////////////!
    //   //*its for get data from wallet
    //   ////////////////////////////////////////////////////////////////////////////////////////////////////////////////!
    //   async getLeaderData(user: any) {                  // send the message in queue
    //     try {
    //       await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {        // make listener for response from the tracer service
    //         await this.channelWrapper.sendToQueue(
    //           'leaderWallet',
    //           Buffer.from(JSON.stringify(user)),
    //         );
    //         Logger.log('Sent To get wallet leader');
    //         await this.channelWrapper.consume('ResponseleaderWallet', async (message) => {             // consume to the tracerResponse
    //           // console.log('backMessage', JSON.parse(message.content.toString()))            // log the response from the tracer service
    //           const ndata = JSON.parse(message.content.toString())
    //           this.cacheManager.set(`getUserWalletData:${user.id}`, ndata)
    //           // console.log( await this.cacheManager.get('getLeaderData'))
    //           channel.ack(message)                   // ack the message for finished the connecion
    //         })
    //       })
    //     } catch (error) {
    //       throw new HttpException(
    //         'error while sending message to wallet for getting wallet data',
    //         HttpStatus.INTERNAL_SERVER_ERROR,
    //       );
    //     }
    //   }





    //   ////////////////////////////////////////////////////////////////////////////////////////////////////////////////!
    //   //*its for get data signal
    //   ////////////////////////////////////////////////////////////////////////////////////////////////////////////////!
    //   async getLeaderSignal(user: any) {                  // send the message in queue
    //     try {
    //       await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {        // make listener for response from the tracer service
    //         await this.channelWrapper.sendToQueue(
    //           'leadersignal',
    //           Buffer.from(JSON.stringify(user)),
    //         );
    //         Logger.log('Sent To get wallet leader');
    //         await this.channelWrapper.consume('Responseleadersignal', async (message) => {             // consume to the tracerResponse
    //           console.log('backMessage', JSON.parse(message.content.toString()))            // log the response from the tracer service
    //           const ndata = JSON.parse(message.content.toString())
    //           await this.cacheManager.set('getLeaderSignal', ndata)
    //           const backDataFromsignal = await this.cacheManager.get('getLeaderSignal')
    //           console.log(',,.,.,.,.', backDataFromsignal)
    //           channel.ack(message)                   // ack the message for finished the connecion
    //         })
    //       })
    //     } catch (error) {
    //       throw new HttpException(
    //         'error while sending message to wallet for getting wallet data',
    //         HttpStatus.INTERNAL_SERVER_ERROR,
    //       );
    //     }
    //   }



    //   ////////////////////////////////////////////////////////!
    //   //! the other algorithmmmmmmmmmmmm
    //   ////////////////////////////////////////////////////////!
    //   // message reciever 


    //   // @RabbitSubscribe({           // uncleared!!!   
    //   //     exchange: 'exchange1',     // the exchange name
    //   //     routingKey: 'w-f-r',   //routing key
    //   //     queue: 'subscribe-queue',       // the queue
    //   //   })
    //   //   public async pubSubHandler(msg: {}) {         // then handle the message
    //   //     console.log(`Received message: ${JSON.stringify(msg)}`);
    //   //   }




    //   // sendMessage(){              // function send message for sending message
    //   //   // amqpConnection.publish<CustomModel>('exchange1', 'subscribe-route', {foo :'hossen' , bar : 'khodakhah'});
    //   //   this.amqpConnection.publish<CustomModel>('exchange1', 'rpc-route', {foo :'hossen' , bar : 'khodakhah22222'});     // send the message to the consumer
    //   //   ////////////////////////////!
    //   //   //! its uncleared!!!    
    //   //   ////////////////////////////!
    //   //   // export class AppController {
    //   //   //   public publish<T = any>(   
    //   //   //     exchange: string,           
    //   //   //     routingKey: string, 
    //   //   //     message: T,
    //   //   //     options?: amqplib.Options.Publish    
    //   //   //   )
    //   //   this.amqpConnection.publish('exchange1', 'rpc-route', { msg: 'hello world' });          // this is for public publish in chhannell
    //   // }   




    //   // ////////////////////////////////////////////////////////////////////!
    //   // create(createMessagingDto: CreateMessagingDto) {   
    //   //   return 'This action adds a new messaging';
    //   // }

    //   // findAll() {
    //   //   return `This action returns all messaging`;
    //   // }

    //   // findOne(id: number) {
    //   //   return `This action returns a #${id} messaging`;
    //   // }

    //   // update(id: number, updateMessagingDto: UpdateMessagingDto) {
    //   //   return `This action updates a #${id} messaging`;
    //   // }

    //   // remove(id: number) {
    //   //   return `This action removes a #${id} messaging`;
    //   // }
}
