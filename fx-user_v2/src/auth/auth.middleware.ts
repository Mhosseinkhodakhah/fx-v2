import { Injectable, NestMiddleware } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Respons } from 'src/response/response';
import { userInterFace } from 'src/user/entities/user.entity';
const jwt = require('jsonwebtoken')



@Injectable()
export class auth implements NestMiddleware {
  constructor(@InjectModel('user') private readonly userModel :Model<userInterFace>){}
  use(req: any, res: any, next: () => void) {
    // console.log(req.headers)
    let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
    ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(" ")[1];
  }

  // console.log(token)

  if (!token) {
      return new Respons(req , res , 401 , 'user authorization' , 'authorize user' , 'token Expired!' , null)
  }
  
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.SECRET_KEY );   

    if (!decoded) {
      return new Respons(req , res , 401 , 'user authorization' , 'authorize user' , 'token Expired!' , null)
    }
    
    req.user = decoded.userData;
    next();
  } catch (err) {
    return new Respons(req , res , 401 , 'user authorization' , 'authorize user' , 'token Expired!' , null)
  
  }
  }
}
