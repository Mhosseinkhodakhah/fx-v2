import { Injectable, NestMiddleware } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
const jwt = require('jsonwebtoken')



@Injectable()
export class auth implements NestMiddleware {
  constructor(){}
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
    return {
      message: 'user authentications',
      statusCode: 401,
      error : 'token Expired!'
    }
  }

  console.log('level 2 for token . . .' , token)
  
  try {
    // Verify token
    console.log('verifying token . . .')
    const decoded = jwt.verify(token, process.env.SECRET_KEY );   

    if (!decoded) {
      console.log('error one . . .' , decoded)
      return {
        message: 'user authentications',
        statusCode: 401,
        error : 'token Expired!'
      }
    }
    
    req.user = decoded.userData;
    console.log(req.user)
    next();
  } catch (err) {
    console.log('catch error . . .' , err)
    return {
      message: 'user authentications',
      statusCode: 401,
      error : 'token Expired!'
    }
  
  }
  }
}
