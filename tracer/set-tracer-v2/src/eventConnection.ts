import client, { Connection, Channel, ConsumeMessage } from "amqplib";
import { signalInterFace, signalModel } from "./DB/model";


class RabbitMQConnection {
    connection!: Connection;
    channel!: Channel;
    private connected!: Boolean;
    private signalModel = signalModel

    constructor() {
        this.connect()
        this.channel.consume(
            'add-signal',
            async (msg) => {
                {
                    if (!msg) {
                        return console.error(`Invalid incoming message`);
                    }
                    const data = JSON.parse(msg.content.toString())
                    console.log('message recieve from signal service . . .')
                    switch (data.message) {
                        case 'create':
                            let newSignal = data.signal;
                            delete newSignal._id;
                            await this.signalModel.create(newSignal)
                            break;

                        case 'update':
                            let signalName = data.signalName;
                            let signal = await this.signalModel.findOne(data.signalName)
                            let newData = { ...signal?.toObject(), ...data.signal }
                            await signal?.updateOne(newData)
                            break;

                        default:
                            console.log(data.message, '>>>>>>>>message is not defined here>>>>>>')
                            break;
                    }
                    this.channel.ack(msg);
                }
            },
            {
                noAck: false,
            }
        );
    }


    async connect() {
        if (this.connected && this.channel) return;
        else this.connected = true;

        try {
            console.log(`⌛️ Connecting to Rabbit-MQ Server`);
            this.connection = await client.connect(
                `amqp://localhost`
            );

            console.log(`✅ Rabbit MQ Connection is ready`);

            this.channel = await this.connection.createChannel();

            await this.channel.assertQueue('tracer', {
                durable: true,
            });

            console.log(`🛸 Created RabbitMQ Channel successfully`);
        } catch (error) {
            console.error(error);
            console.error(`Not connected to MQ Server`);
        }
    }



    async sendToQueue(queue: string, message: any) {
        try {
            if (!this.channel) {
                await this.connect();
            }

            this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

}

const mqConnection = new RabbitMQConnection();

export default mqConnection;