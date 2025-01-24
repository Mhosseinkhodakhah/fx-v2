import { Module } from '@nestjs/common';
import { StoryService } from './story.service';
import { StoryController } from './story.controller';
import { storySchema } from './entities/story.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forRoot(process.env.MONGO_CONNECTION_STRING),
  MongooseModule.forFeature([{ name: 'story', schema: storySchema }])],
  controllers: [StoryController],
  providers: [StoryService],
})
export class StoryModule { }
