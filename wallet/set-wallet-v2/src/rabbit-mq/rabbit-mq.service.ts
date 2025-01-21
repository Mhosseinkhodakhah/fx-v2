import { Inject, Injectable } from '@nestjs/common';
import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { ConfirmChannel, Channel } from 'amqplib';
import { Model } from 'mongoose';
import { walletInterFace } from 'src/wallet/entities/wallet.entity';


@Injectable()
export class RabbitMqService {
    private channelWrapper: ChannelWrapper;         // make the channel wrapper
    constructor(@InjectModel('wallet') private walletModel: Model<walletInterFace>) {
        const connection = amqp.connect(['amqp://localhost']);     // connect to rabbit
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////!
        //*its for assert the queues
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////!
        this.channelWrapper = connection.createChannel({             // crathe the channel
            setup: (channel: Channel) => {                                   // setup the channel
                channel.assertQueue('walletService', { durable: true });          // assert the queue
                channel.assertQueue('createWallet', { durable: true });          // assert the queue for create wallet from user service
            },
        });
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////!
        //*its listener for create wallet that sent by user service
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////!
        this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {          // add setup for channel
            await channel.consume('createWallet', async (message) => {
                try {
                    const user = JSON.parse(message.content.toString())
                    const newWallet = await this.walletModel.create({ owner: user })
                    const newWallet2= {...newWallet}
                    delete newWallet2._id
                    await this.walletEvent(newWallet2.owner , newWallet2 , 'createNewWallet')
                    channel.ack(message);
                } catch (error) {
                    console.log('error occured while creating new user wallet>>>>>', `${error}`)
                }
            })
        })
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////!
    //*its for updating the user data in query service
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////!
    async walletEvent(user:any, walletData: {}, message: string) {                // send the message in queue
        try {
            let data = { user: user, data: walletData }
            await this.channelWrapper.sendToQueue(
                'walletService',
                Buffer.from(JSON.stringify(data)),
            );
        } catch (error) {
            console.log('error occured whent trying to send to increase point user')
            console.log(`${error}`)
        }
    }   
}
