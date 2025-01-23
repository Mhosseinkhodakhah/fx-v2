import { Inject, Injectable } from '@nestjs/common';
import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { Channel ,ConfirmChannel } from 'amqplib';
import { Model } from 'mongoose';
import { signalInterFace } from 'src/signal/entities/signal.entity';


@Injectable()
export class RabbitMqService {
    private channelWrapper: ChannelWrapper;         // make the channel wrapper
    @InjectModel('signal') private signalModel : Model<signalInterFace>
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

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////!
        //*its for when the other services want user data
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////!
        this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {          // add setup for channel
          // await channel.assertQueue('signal', { durable: true });                    // assert the queu
          await channel.consume('tracer', async (message) => {
            const data = JSON.parse(message.content.toString())
            switch (data.mode) {
                case 0:
                    
                    break;
                    case 2:
                    
                    break;
                    case 3:
                    
                    break;
            
                default:
                    break;
            }
          })
        })
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
