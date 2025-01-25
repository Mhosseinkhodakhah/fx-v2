import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StoryModule } from './story/story.module';
import { RabbitMqService } from './rabbit-mq/rabbit-mq.service';
import { MongooseModule } from '@nestjs/mongoose';
import { storySchema } from './story/entities/story.entity';
import { MulterModule } from '@nestjs/platform-express';
import { auth } from './auth/auth.middleware';
import { StoryController } from './story/story.controller';
import { ConfigService, ConfigModule } from '@nestjs/config'

@Module({
  imports: [StoryModule , 
    ConfigModule.forRoot({envFilePath : 'config.env' , isGlobal : true}),
    MulterModule.register({ dest: '/home/uploadedFiles' }),
    MongooseModule.forRoot(`mongodb+srv://kianlucifer0098:lucifer25255225@cluster0.p5b71z1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`),
    MongooseModule.forFeature([{name : 'story' , schema : storySchema}])
  ],
  controllers: [AppController],
  providers: [AppService, RabbitMqService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(auth).forRoutes(StoryController)
  }
}
