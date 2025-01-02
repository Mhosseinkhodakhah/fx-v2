import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { userInterFace } from './entities/user.entity';
import { Model } from "mongoose";
import { Respons } from 'src/response/response';
import { refreshTokenDTO } from './dto/refreshTokenDto.dto';
import { TokenService } from 'src/token/token.service';
import { loginDto } from './dto/loginDto.dto';
const jwt = require('jsonwebtoken')

@Injectable()
export class UserService {
 
  constructor(@InjectModel('user') private  userModel:Model<userInterFace> , private readonly tokenService : TokenService){}

  async getUserInfo(req : any , res : any){
    const userId = req.user._id
    const user = await this.userModel.findById(userId)
    return new Respons(req , res , 200 , 'get user info' , 'getting user info' , null , user)
  }



  async checkToken(req : any , res : any){
    const userData = await this.userModel.findById(req.user._id)
    return new Respons(req, res, 200, 'checking user token', 'check token' ,null, { user: userData})
  }


  async refreshToken(req:any , res:any , body : refreshTokenDTO){
    const token = body.refreshToken;
    console.log(body)
    try {
      const decoded = jwt.verify(token, process.env.REFRESH_SECRET_KEY)
      if (!decoded) {
        console.log('111')
        return new Respons(req, res, 401, 'get new token!!' ,'this token is expired', 'refresh token expired', null)
      }
      const user = await this.userModel.findOne({ email: decoded.userData })

      if (!user) {
        console.log('222')
        return new Respons(req, res, 401, 'get new token!!', 'this token is not valid' ,'refresh token expired', null)
      }
      const userData = {
        _id: user._id,
        username: user.username,
        role: user.role,
        suspend: user.suspend,
        email: user.email,
        wallet: user.wallet,
        region: user.region,
        profile: user.profile,
        level: user.level,
        leaders: user.leaders
      }
      const Token = await this.tokenService.tokenize(userData)
      const refreshToken = await this.tokenService.refreshToken({email : user.email})
      let newData = {...user.toObject() , token : token , refreshToken : refreshToken}
      return new Respons(req, res, 200, 'get new token by refresh token!!!', 'the token has been successfully refreshed!',null,newData)
    } catch (error) {
      console.log(error)
      return new Respons(req, res, 401, 'get new token!!', 'this token is not valid' ,'refresh token expired', null)
    }
  }




  async loginUser(req : any, res:any , body : loginDto) {
    // console.log(body)

    const user = await this.userModel.findOne({email : body.email}).select(['-refreshToken'])
    if (!user) {
      return new Respons(req, res, 404, 'loging in user', 'login user failed' ,'this user is not exist in the database', null)
    }
    const hashedPassword = await this.tokenService.passwordHasher(body.password)

    if (hashedPassword != user.password) {
      return new Respons(req, res, 403, 'loging in user', 'login user failed' ,'the password is incorrect!!!', null)
    }
    const userData = {
      _id: user._id,
      username: user.username,
      role: user.role,
      suspend: user.suspend,
      email: user.email,
      wallet: user.wallet,
      region: user.region,
      profile: user.profile,
      level: user.level,
      leaders: user.leaders
    }
    const token = await this.tokenService.tokenize(userData)
    const refreshToken = await this.tokenService.refreshToken({email : user.email})
    const newData = {...(user.toObject()) , token : token , refreshToken : refreshToken}
    
    delete newData.password
    return new Respons(req, res, 200, 'loging in user', 'user login successfull' ,null, newData)

  }



}
