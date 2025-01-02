import { Injectable } from '@nestjs/common';
import { refreshToken, tokenInterface } from 'src/interfaces/interfaces.interface';
const jwt = require('jsonwebtoken')
const crypto = require('crypto')


@Injectable()
export class TokenService {


    async passwordHasher(password : string){
        const algorithm = "sha256"
        const digest = crypto.createHash(algorithm).update(password).digest("hex")
        return(digest)
    }


    async tokenize(data : tokenInterface){
        return jwt.sign({userData : data} , process.env.SECRET_KEY , {expiresIn : '12h'})
    }


    async refreshToken(data : refreshToken){
        return jwt.sign({userData : data} , process.env.REFRESH_SECRET_KEY , {expiresIn : '30d'})
    }

}
