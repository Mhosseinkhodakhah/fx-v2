import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { userInterFace } from './entities/user.entity';
import { Model } from "mongoose";
import { Respons } from 'src/response/response';


@Injectable()
export class UserService {
 
  constructor(@InjectModel('user') private  userModel:Model<userInterFace>){}

  async getUserInfo(req : any , res : any){
    const userId = req.user._id
    const user = await this.userModel.findById(userId)
    return new Respons(req , res , 200 , 'get user info' , 'getting user info' , null , user)
  }


}
