import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { userInterFace } from './entities/user.entity';
import { Model } from "mongoose";
import { Respons } from 'src/response/response';
import { refreshTokenDTO } from './dto/refreshTokenDto.dto';
import { TokenService } from 'src/token/token.service';
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
    try {
      const decoded = jwt.verify(token, process.env.REFRESH_SECRET_KEY)
      if (!decoded) {
        return new Respons(req, res, 401, 'get new token!!' ,'this token is expired', 'refresh token expired', null)
      }
      const user = await this.userModel.findOne({ email: decoded.userData })

      if (!user) {
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
      return new Respons(req, res, 200, 'get new token by refresh token!!!', 'the token has been successfully refreshed!',null, {
        token: Token,
        refreshToken: refreshToken,
        user: user
      })
    } catch (error) {
      return new Respons(req, res, 401, 'get new token!!', 'this token is not valid' ,'refresh token expired', null)
    }
  }




  async loginUser(body: Request, req, res) {
    // console.log(body)
    this.userModel.findOne({ email: body['email'] }).then(async (resault) => {
      if (!resault) {
        return new Respons(req, res, 404, 'loging in user', 'login user failed' ,'this user is not exist in the database', null)
      }
      const hashedPassword = await this.tokenService.passwordHasher(body['password'])

      if (hashedPassword != resault.password) {
        return new Respons(req, res, 403, 'loging in user', 'login user failed' ,'the password is incorrect!!!', null)
      }
      const userData = {
        _id: resault._id,
        username: resault.username,
        role: resault.role,
        suspend: resault.suspend,
        email: resault.email,
        wallet: resault.wallet,
        region: resault.region,
        profile: resault.profile,
        level: resault.level,
        leaders: resault.leaders
      }
      const token = await this.tokenService.tokenize(userData)
      const refreshToken = await this.tokenService.refreshToken({email : resault.email})

      return new Respons(req, res, 200, 'loging in user', 'user login successfull' ,null, { token: token, refreshToken: refreshToken, user: resault, walletBalance: 0 })
    })
  }



}
