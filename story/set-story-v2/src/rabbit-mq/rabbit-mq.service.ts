import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { Channel } from 'amqplib';
import { ConfirmChannel } from 'amqplib';
import { Model } from 'mongoose';
import { storyEvent } from 'src/interfaces/interfaces.interface';
import { storyInterface } from 'src/story/entities/story.entity';



@Injectable()
export class RabbitMqService {

    private channelWrapper: ChannelWrapper;
    @InjectModel('story') private storyModel: Model<storyInterface>

    constructor() {
        const connection = amqp.connect('amqp://localhost')
        this.channelWrapper = connection.createChannel({
            setup: (channel: Channel) => {
                channel.assertQueue('storyService', { durable: true })
            }
        })
    }


    async updateStory(mainId: string, story: storyEvent, message: string) {

        let data = { mainId: mainId, story: story, message: message }

        try {
            await this.channelWrapper.sendToQueue('storyService', Buffer.from(JSON.stringify(data)))
            console.log('message sent to query service')
        } catch (error) {
            console.log('error occured while trying to sent event to query service>>>', `${error}`)
        }
    }
}
