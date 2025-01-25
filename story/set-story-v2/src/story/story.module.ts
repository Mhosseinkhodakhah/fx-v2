import { Module } from '@nestjs/common';
import { StoryService } from './story.service';
import { StoryController } from './story.controller';
import { RabbitMqService } from 'src/rabbit-mq/rabbit-mq.service';
import { MongooseModule } from '@nestjs/mongoose';
import { storySchema } from './entities/story.entity';

@Module({
  imports: [MongooseModule.forRoot(`mongodb+srv://kianlucifer0098:lucifer25255225@cluster0.p5b71z1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`),
  MongooseModule.forFeature([{ name: 'story', schema: storySchema }])],
  controllers: [StoryController],
  providers: [StoryService, RabbitMqService],
})
export class StoryModule { }
