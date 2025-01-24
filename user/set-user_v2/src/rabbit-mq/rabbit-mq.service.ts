import { Inject, Injectable } from '@nestjs/common';
import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { Channel } from 'amqplib';
import { payerInterface, walletCreationData } from 'src/interfaces/interfaces.interface';


@Injectable()
export class RabbitMqService {
    private channelWrapper: ChannelWrapper;         // make the channel wrapper
    constructor() {
        const connection = amqp.connect(['amqp://localhost']);     // connect to rabbit
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////!
        //*its for assert the queues
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////!
        this.channelWrapper = connection.createChannel({             // crathe the channel
            setup: (channel: Channel) => {                                   // setup the channel
                channel.assertQueue('userService', { durable: true });          // assert the queue
                channel.assertQueue('createWallet', { durable: true });          // assert the queue for create wallet from user service
                channel.assertQueue('payToLeader' , {durable : true});           // pay to leader after subscribing him
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
