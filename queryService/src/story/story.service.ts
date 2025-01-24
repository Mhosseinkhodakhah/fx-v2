import { Injectable } from '@nestjs/common';
import { CreateStoryDto } from './dto/create-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { storyInterface } from './entities/story.entity';

@Injectable()
export class StoryService {
  
  @InjectModel('story') private storyModel : Model<storyInterface>
  
  async getAllStories(req:any, res:any) {
    const user = req.user._id;
    const userName = req.user.username;
    const seen = await this.storyModel.find({ $and: [{ activeStory: true }, { deleted : false } , { seenStory: { $in : user } }, {'user.userId' : {$ne : user}}] })
    const unSeen = await this.storyModel.find({ $and: [{ activeStory : true } , { deleted : false }  , { seenStory: { $ne: user } } , {'user.userId' : {$ne : user}}] })
    const self = await this.storyModel.find({$and:[{ activeStory : true } , { deleted : false }  , {'user.userId' :  user}]})
    const unSeenStory = {}
    const SeenStory = {}
    seen.forEach(elem=>{
      if (!SeenStory[elem.user.username]){
        SeenStory[elem.user.username] = []
      }
    })
    console.log(SeenStory)
    seen.forEach(elem => {
      SeenStory[elem.user.username].push(elem)
    })
    unSeen.forEach(elem=>{
      if (!unSeenStory[elem.user.username]){
        unSeenStory[elem.user.username] = [] 
      }
    })
    console.log(unSeenStory)
    unSeen.forEach(elem => {
      unSeenStory[elem.user.username].push(elem)
    })
    return {
      message : 'get all stories done',
      data : { seen : SeenStory , unSeen : unSeenStory , self : self },
      statusCode : 200
    }
  }



  async getStories(req:any , res:any , leaderId : string){
    // const user = req.user._id;
    const stories = await this.storyModel.find({ $and : [{ activeStory : true }, { 'user.userId' : leaderId }] })
    // const unSeen = await this.storyModel.find({ $and: [{ activeStory: true } , { seenStory : { $ne: user } }] })
    return {
      message : 'get leader story',
      data : { stories : stories.reverse() },
      statusCode : 200
    }
  }


}
