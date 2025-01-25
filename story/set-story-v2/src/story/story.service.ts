import { Injectable } from '@nestjs/common';
import { CreateStoryDto } from './dto/create-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';
import { InjectModel } from '@nestjs/mongoose';
import { storyInterface } from './entities/story.entity';
import { Model } from 'mongoose';
import { storyEvent } from 'src/interfaces/interfaces.interface';
import { RabbitMqService } from 'src/rabbit-mq/rabbit-mq.service';

@Injectable()
export class StoryService {

  constructor(@InjectModel('story') private storyModel : Model<storyInterface> , private readonly eventService : RabbitMqService){}


  async uploadStory(req:any, res:any, fileName : {filename : string}[]) {
    console.log(fileName)
    const user = req.user
    for (let i = 0 ; i < fileName.length ; i ++){
      let newStory = await this.storyModel.create({
        user: {
          username: req.user.username,
          userId: req.user._id,
          profile: req.user.profile,
        },
        url: `https://cdn.spider-cryptobot.site/story/${fileName[i].filename}`,
        type: 'picture',
      })
      let queryData : storyEvent = {...newStory.toObject() , mainId : newStory._id.toString()  }
      // delete queryData._id
      await this.eventService.updateStory(queryData.mainId , queryData , 'create')
    }
  }


  async makeSeen(req:any, res:any, storyId: string) {
    const user = req.user._id;
    await this.storyModel.findByIdAndUpdate(storyId, { $push: { seenStory: user } })
    // const seenSignals = await this.storyModel.find({ $and: [{ activeStory: true }, { seenStory: { $in: user } }] })
    // const unSeen = await this.storyModel.find({ $and: [{ activeStory: true }, { seenStory: { $ne: user } }] })
    let updated = await this.storyModel.findById(storyId)
    let queryData : storyEvent = {...updated.toObject() , mainId : updated._id.toString()} 
    await this.eventService.updateStory(queryData.mainId , queryData , 'create')
    
    return {
      message : 'story have been seen by user',
      statusCode : 200,
    }
    
  }


  async likeStory(req : any, res:any, storyId: string) {
    const user = req.user._id;
    const story = await this.storyModel.findById(storyId)
    let disLike = false
    if (story.likes.includes(user)){
      disLike = true
    }
    let resault;
    if (disLike){
      const dislike = await this.storyModel.findByIdAndUpdate(storyId, { $pull : { likes : user } })
      resault = dislike
    }else{
      const like = await this.storyModel.findByIdAndUpdate(storyId, { $push : { likes : user } })
      resault = like
    }
    let queryData : storyEvent = {...resault.toObject() , mainId : resault._id.toString()} 
    await this.eventService.updateStory(queryData.mainId , queryData , 'create')
    return {
      message : 'story liked by user!',
      statusCode : 200,
      data : resault.likes.length
    }
  }


  async deleteStory(req:any, res:any , storyId:string) {
    const user = req.user._id;
    await this.storyModel.findByIdAndUpdate(storyId , {deleted : true})
    const stories = await this.storyModel.find({ $and: [{ active: true } , { deleted : false } , { 'user.userId': req.user._id }] })
    let updated = await this.storyModel.findById(storyId)
    let queryData : storyEvent = {...updated.toObject() , mainId : updated._id.toString()} 
    await this.eventService.updateStory(queryData.mainId , queryData , 'create')
    return {
      message : 'delete story done',
      statusCode : 200,
      data : stories
    }
  }



}
