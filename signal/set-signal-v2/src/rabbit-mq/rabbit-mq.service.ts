import { Inject, Injectable } from '@nestjs/common';
import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { Channel } from 'amqplib';


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
                channel.assertQueue('signalService', { durable: true });          // assert the queue
                channel.assertQueue('tracer', { durable: true });          // assert the queue for interaction with tracer signals
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
    async updateSignal(signalName: string, updateData: {}, message: string) {                // send the message in queue
        try {
            let data = { signal: signalName, data: updateData , message : message}
            await this.channelWrapper.sendToQueue(
                'signalService',
                Buffer.from(JSON.stringify(data)),
            );
        } catch (error) {
            console.log('error occured whent trying to send to increase point user')
            console.log(`${error}`)
        }
    }
}
