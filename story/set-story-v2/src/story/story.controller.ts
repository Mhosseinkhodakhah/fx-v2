import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, Req, Res, UploadedFiles, Put } from '@nestjs/common';
import { StoryService } from './story.service';
import { CreateStoryDto } from './dto/create-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer'
import { extname } from 'path';
// import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
// import { Cron, CronExpression } from '@nestjs/schedule';

@Controller('story')
export class StoryController {
  constructor(private readonly storyService: StoryService) {}


  @Post('upload')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'storyFile' , maxCount : 5 }] 
    , {
    storage: diskStorage({
      destination: '/home/uploadedFiles/story'
      , filename: (req, files, cb) => {
        // console.log(files)
        // Generating a 32 random chars long string
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
        //Calling the callback passing the random name generated with the original extension name
        cb(null, `${randomName}${extname(files.originalname)}`)
      }
  })}))
  async upload( @Req() req:any , @Res() res:any, @UploadedFiles(
  ) storyFile) {
    // console.log()
    console.log(storyFile.storyFile)
    console.log(req.user)
    return this.storyService.uploadStory(req, res, storyFile.storyFile)
    // return profile
  }


  @Put('seen/:storyId')
  seen(@Param('storyId') storyId : string , @Req() req , @Res() res) {
    return this.storyService.makeSeen(req , res , storyId);
  }

  @Put('like/:storyId')
  like(@Param('storyId') storyId : string , @Req() req , @Res() res) {
    return this.storyService.likeStory(req , res , storyId);
  }


  @Delete('delete/:storyId')
  deleter( @Req() req , @Res() res , @Param('storyId') storyId : string){
    return this.storyService.deleteStory(req , res , storyId)
  }

}
