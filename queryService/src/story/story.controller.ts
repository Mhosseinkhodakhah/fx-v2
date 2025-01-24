import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res } from '@nestjs/common';
import { StoryService } from './story.service';
import { CreateStoryDto } from './dto/create-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';

@Controller('story')
export class StoryController {
  constructor(private readonly storyService: StoryService) {}

  @Get('all')
  getAll( @Req() req : any , @Res() res :any){
    return this.storyService.getAllStories(req , res)
  }
  
  @Get('all/:leaderId')
  getStories( @Req() req :any , @Res() res:any , @Param('leaderId') leaderId : string){
    return this.storyService.getStories(req , res , leaderId)
  }


}
