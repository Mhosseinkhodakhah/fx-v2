import { Injectable, NestMiddleware, UseInterceptors } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResponseInterceptor } from 'src/response/response.interceptor';
import { userInterFace } from 'src/user/entities/user.entity';
const jwt = require('jsonwebtoken')



@Injectable()
export class auth implements NestMiddleware {
  constructor(@InjectModel('user') private readonly userModel :Model<userInterFace>){}
  use(req: any, res: any, next: () => void) {
    console.log('its here . . .')
    let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
    ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(" ")[1];
  }

  
  if (!token) {
    return res.status(401).json({
      success:false , 
      data : null,
      message: 'user authentication falied',
      error : 'token Expired!'
    })
  }

  console.log('level 2 for token . . .' , token)
  
  try {
    // Verify token
    console.log('verifying token . . .')
    const decoded = jwt.verify(token, process.env.SECRET_KEY );   

    if (!decoded) {
      console.log('error one . . .' , decoded)
      return res.status(401).json({
      success:false , 
        data : null,
        message: 'user authentication falied',
        error : 'token Expired!'
      })
    }
    
    req.user = decoded.userData;
    console.log(req.user)
    next();
  } catch (err) {
    return res.status(401).json({
      success:false,
      data : null,
      message: 'user authentication falied',
      error : 'token Expired!'
    })
  }
  }
}
