import { Injectable, Res } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { userInterFace } from './entities/user.entity';
import { Model } from "mongoose";
import { refreshTokenDTO } from './dto/refreshTokenDto.dto';
import { TokenService } from 'src/token/token.service';
import { loginDto } from './dto/loginDto.dto';
import { regisrtDto } from './dto/registerDto.dto';
import { EmailService } from 'src/email/email.service';
import { passwordBody } from './dto/passwordDto.dto';
import { InterconnectionService } from 'src/interconnection/interconnection.service';
import { RabbitMqService } from 'src/rabbit-mq/rabbit-mq.service';
import { leaderLoginDto } from './dto/leaderLoginDTo.dto';
import { subsCribers } from './entities/subscribers.entity';
const jwt = require('jsonwebtoken')


@Injectable()
export class UserService {

  constructor(private readonly interConnection: InterconnectionService,
    @InjectModel('user') private userModel: Model<userInterFace>,
    @InjectModel('subScribers') private subScriberModel: Model<subsCribers>,
    private readonly tokenService: TokenService,
    private readonly emailService: EmailService,
    private readonly eventService: RabbitMqService) { }



  async #generateNumber(): Promise<number> {
    let randomNumber = Math.floor(1000 + Math.random() * 9000);
    return randomNumber
  }




  async checkToken(req: any, res: any) {
    const userData = await this.userModel.findById(req.user._id)
    return new Respons(req, res, 200, 'checking user token', 'check token', null, { user: userData })
  }


  async refreshToken(req: any, res: any, body: refreshTokenDTO) {
    const token = body.refreshToken;
    console.log(body)
    try {
      const decoded = jwt.verify(token, process.env.REFRESH_SECRET_KEY)
      if (!decoded) {
        console.log('111')
        return new Respons(req, res, 401, 'get new token!!', 'this token is expired', 'refresh token expired', null)
      }

      const user = await this.userModel.findOne({ email: decoded.userData.email })

      if (!user) {
        console.log('222')
        return new Respons(req, res, 401, 'get new token!!', 'this token is not valid', 'refresh token expired', null)
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
      const refreshToken = await this.tokenService.refreshToken({ email: user.email })
      console.log('token is this . . .', Token)
      let newData = { ...user.toObject(), token: Token, refreshToken: refreshToken }
      return new Respons(req, res, 200, 'get new token by refresh token!!!', 'the token has been successfully refreshed!', null, newData)
    } catch (error) {
      console.log(error)
      return new Respons(req, res, 401, 'get new token!!', 'this token is not valid', 'refresh token expired', null)
    }
  }


  async loginUser(req: any, res: any, body: loginDto) {
    const user = await this.userModel.findOne({ email: body.email }).select(['-refreshToken'])
    if (!user) {
      return new Respons(req, res, 404, 'loging in user', 'login user failed', 'this user is not exist in the database', null)
    }
    const hashedPassword = await this.tokenService.passwordHasher(body.password)

    if (hashedPassword != user.password) {
      return new Respons(req, res, 403, 'loging in user', 'login user failed', 'the password is incorrect!!!', null)
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
    const refreshToken = await this.tokenService.refreshToken({ email: user.email })
    const newData = { ...(user.toObject()), token: token, refreshToken: refreshToken }

    delete newData.password
    return new Respons(req, res, 200, 'loging in user', 'user login successfull', null, newData)

  }


  async loginLeader(body: leaderLoginDto, req, res) {
    const leader = await this.userModel.findOne({ email: body.email })
    if (!leader) {
      return new Respons(req, res, 404, 'loging in leader', 'leader cant login , this email has not been registered', 'resource not found', null)
    }
    if (leader.role < 3) {
      return new Respons(req, res, 403, 'loging in user', 'not permisioned', 'you are not approved leader yet', null)
    }
    const hashedPassword = await this.tokenService.passwordHasher(body.password)

    if (hashedPassword != leader.password) {
      return new Respons(req, res, 403, 'loging in user', 'incorrect password', 'the password is incorrect!!!', null)
    }
    req.user = leader
    const userData = {
      _id: leader._id,
      username: leader.username,
      role: leader.role,
      suspend: leader.suspend,
      email: leader.email,
      wallet: leader.wallet,
      region: leader.region,
      profile: leader.profile,
      level: leader.level,
      leaders: leader.leaders
    }
    const token = await this.tokenService.tokenize(userData)
    const refreshToken = await this.tokenService.refreshToken({ email: leader.email })
    let newData = { ...leader.toObject(), token: token, refreshToken: refreshToken, walletBalance: 0 }
    return new Respons(req, res, 200, 'loging in user', 'leader loged in successfully', null, newData)
  }

  async forgetPassword(req: any, res: any, userEmail: string) {
    try {
      const user = await this.userModel.findOne({ email: userEmail })
      if (!user) {
        return new Respons(req, res, 404, 'getting reset token', 'this user is not exist on database!!!', 'no account found', null)
      }
      const resetToken = await this.#generateNumber()
      user.resetPasswordToken = resetToken.toString()
      user.resetTokenExpire = ((new Date().getSeconds()) + (24 * 3600)).toString()
      user.save()
      await this.emailService.sendResetPasswordEmail(resetToken.toString(), user.email, user.username)
      return new Respons(req, res, 200, 'getting reset token', 'reset password token sendt to user email!!!', null, { resetToken: resetToken })

    } catch (error) {
      return new Respons(req, res, 500, 'getting reset token', 'connecting to database on geting reset password failed!!', `${error}`, null)
    }
  }


  async resetPasswordWithToken(resetToken: string, userEmail: string, req: any, res: any) {
    const user = await this.userModel.findOne({ email: userEmail }).select(['-password', '-refreshToken'])
    console.log(user)
    if (!user) {
      return new Respons(req, res, 404, 'reset password', 'reset password with reset token!!', 'this user is not exist on database!!!', null)
    }

    if (user.resetPasswordToken != resetToken) {
      return new Respons(req, res, 422, 'reset password', 'reset password with reset token failed', 'the reset password code is not valid', null)
    }

    if ((parseInt(user.resetTokenExpire) - (new Date().getSeconds())) <= 0) {
      return new Respons(req, res, 422, 'reset password', 'reset password with reset token failed', 'the reset token expired!!!!try again!!!', null)
    }
    return new Respons(req, res, 200, 'reset password', 'reset password with reset token!! successfull', null, user)
  }


  async finalResetPasswor(req: any, res: any, body: passwordBody, userEmail: string) {
    const user = await this.userModel.findOne({ email: userEmail }).select(['-password', '-refreshToken'])
    if (!user) {
      return new Respons(req, res, 404, 'finalResetPassword', 'this email is not exist on database', 'account not found!', null)
    }
    let password = await this.tokenService.passwordHasher(body.password)
    user.password = password;
    let Updated = { ...user.toObject() }
    delete Updated._id
    await this.eventService.updateUser(user._id, Updated)
    await user.save()
    return new Respons(req, res, 200, 'finalResetPassword', 'the password successfully updated', null, { email: user.email })
  }




  async updateUser(req: any, res: any, body: any) {
    const userId = req.user._id;
    console.log(body)
    const user = await this.userModel.findById(userId).select(['-password', '-refreshToken'])
    let newData = { ...user.toObject(), ...body }
    await user.updateOne(newData)
    let updateData = { ...newData }
    delete updateData._id
    await this.eventService.updateUser(user._id, updateData)
    return new Respons(req, res, 200, 'update user', 'updating user successfully done!', null, newData)
  }


  async uploadPictureProfile(req, res, filename: string) {
    const newPath = `https://cdn.spider-cryptobot.site/profiles/${filename}`
    await this.userModel.findByIdAndUpdate(req.user._id, { profile: newPath })
    const updated = await this.userModel.findById(req.user._id)
    let updateData = { ...updated.toObject() }
    delete updateData._id
    await this.eventService.updateUser(updated._id, updateData)
    return new Respons(req, res, 200, 'uploading profile', 'the profile successfully updated . . .', null, { path: newPath })
  }


  async register(req: any, res: any, body: regisrtDto) {
    try {
      const existance = await this.userModel.findOne({ email: body.email })
      if (existance) {
        if (existance.usingCode) {
          return new Respons(req, res, 409, 'regsiter new user', 'this email had been already registere', 'existance email', null)
        }
        const code = await this.#generateNumber()
        const hashedPassword = await this.tokenService.passwordHasher(body.password)
        // let userData = {...existance , ...body ,code : code , password : hashedPassword }
        existance.password = hashedPassword;
        existance.code = code;
        existance.usingCode = false;
        await this.emailService.sendEmail(code, body.email)               // for sending email for validating the emmail address
        const currentTime = new Date().getTime();
        existance.otpCodeTime = currentTime;
        let updateData = { ...existance.toObject() }
        await existance.save()
        delete updateData._id
        await this.eventService.updateUser(existance._id, updateData)
        return new Respons(req, res, 200, 'code sent to user', 'the code sent to user email successfully. . .  ', null, { email: body.email, code: code })
      }
      const code = await this.#generateNumber()
      const hashedPassword = await this.tokenService.passwordHasher(body.password)
      let data = { ...body, password: hashedPassword, code: code, otoCodeTime: 0 }
      await this.emailService.sendEmail(code, body.email)
      let currentTime = new Date().getTime()
      data.otoCodeTime = currentTime;
      const newUser = await this.userModel.create(data)
      let updateData = (await this.userModel.findById(newUser._id)).toObject()
      delete updateData._id
      await this.eventService.updateUser(newUser._id, updateData)
      return new Respons(req, res, 200, 'code sent to user', 'the code sent to user email successfully. . .  ', null, { email: body.email, code: code })
    } catch (error) {
      console.log('error occured', error)
      return new Respons(req, res, 500, 'code sent to user', 'the code did not sent to user email successfully. . .  ', `${error}`, null)
    }
  }


  async checkOtpCode(req: any, res: any, code: number, email: string) {
    const existinguser = await this.userModel.findOne({ email: email })
    if (!existinguser) {
      return new Respons(req, res, 404, 'check otp code', 'please registere first', `this email did not rigistered.`, null)
    }
    if (existinguser.code != code) {
      return new Respons(req, res, 422, 'check otp code', 'the code is not valid', `wrong otp code`, null)
    }
    let currentTime = new Date().getTime()
    if ((currentTime - existinguser.otpCodeTime) > 2.5 * 60 * 1000) {
      return new Respons(req, res, 403, 'check otp code', 'the time limit of otp code exceeded', 'time limit exceeded', null)
    }
    existinguser.usingCode = true;
    existinguser.otpCodeTime = 0;
    await existinguser.save()
    const user = await this.userModel.findById(existinguser._id).select(['-password'])
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
    const refreshToken = await this.tokenService.refreshToken({ email: user.email })
    let newData = { ...user, token: token, refreshToken: refreshToken }
    return new Respons(req, res, 200, 'check otp code', 'the code validation succeed', null, newData)
  }



  async getLeaderData(req: any, res: any, leaderId: string) {
    try {
      const leader = await this.userModel.findById(leaderId).select(['-password', '-refreshToken']).populate({
        path: 'subScriber',
      }).populate({ path: 'followers' })
      return new Respons(req, res, 200, 'get leader data', 'leader data', null, leader)
    } catch (error) {
      return new Respons(req, res, 500, 'get leader data', 'getting leader data failed', `${error}`, null)
    }
  }


  async folowSomone(req: any, res: any, userId: string) {
    const user1 = await this.userModel.findById(req.user._id)
    const user2 = await this.userModel.findById(userId)

    if (!user2) {
      return {
        message: 'following user failed!',
        statusCode: 404,
        error: 'resource not found!'
      }
    }

    if (user2.role < 3) {
      return {
        message: 'following user failed!',
        statusCode: 400,
        error: 'this leader cant followed before getting approved!'
      }
    }

    let unfollow = false
    if (user1.followings.includes({ id: userId })) {
      unfollow = true
    }

    if (!unfollow) {
      const follower = await this.userModel.findByIdAndUpdate(req.user._id, {
        $addToSet: { followings: { id: userId } }
      })

      const following = await this.userModel.findByIdAndUpdate(userId, {
        $addToSet: { followers: { id: req.user._id } }
      })
      let newData1 = { ...follower.toObject() }
      delete newData1._id
      let newData2 = { ...follower.toObject() }
      delete newData2._id
      await this.eventService.updateUser(follower._id, newData1)
      await this.eventService.updateUser(following._id, newData2)
      const updated = await this.userModel.findById(userId)
      return {
        message: 'following leaders done!',
        statusCode: 200,
        data: updated
      }
    } else {
      const follower = await this.userModel.findByIdAndUpdate(req.user._id, {
        $pull: { followings: { id: userId } }
      })

      const following = await this.userModel.findByIdAndUpdate(userId, {
        $pull: { followers: { id: req.user._id } }
      })
      let newData1 = { ...follower.toObject() }
      delete newData1._id
      let newData2 = { ...follower.toObject() }
      delete newData2._id
      await this.eventService.updateUser(follower._id, newData1)
      await this.eventService.updateUser(following._id, newData2)
      const updated = await this.userModel.findById(userId)
      return {
        message: 'unfollow leader done!',
        statusCode: 200,
        data: updated
      }
    }
  }


  async subscribe(req: any, res: any, leaderId: string) {
    const user1 = await this.userModel.findById(req.user._id)
    const user2 = await this.userModel.findById(leaderId)

    if (!user2) {
      return {
        message: 'subscribing leader failed',
        statusCode: 404,
        error: 'resource not found!'
      }
    }

    if (user2.role < 3) {
      return {
        message: 'subscribing leader failed',
        statusCode: 400,
        error: 'this leader cant subscribed before getting approve!!'
      }
    }

    let unSubscribe = false

    if (unSubscribe) {
      const subscriber = await this.userModel.findByIdAndUpdate(req.user._id, { $pull: { leaders: leaderId } })
      const subscriber2 = await this.userModel.findByIdAndUpdate(req.user._id, { $pull: { subScribing: leaderId } })
      const subscribing = await this.userModel.findByIdAndUpdate(leaderId, {
        $pull: {
          subScriber: {
            userId: req.user._id
          }
        }
      })
      let newData1 = { ...subscriber2.toObject() }
      delete newData1._id;
      let newData2 = { ...subscribing.toObject() }
      delete newData2._id
      await this.eventService.updateUser(subscriber2._id, newData1)
      await this.eventService.updateUser(subscribing._id, newData2)
      const updated = await this.userModel.findById(req.user._id)
      return {
        message: 'unsubscribing leader done!',
        statusCode: 200,
        data: updated
      }
    } else {
      const sub = await this.subScriberModel.findOne({ $and: [{ userId: req.user._id }, { leaderId: user2._id }] })
      if (!sub) {
        await this.subScriberModel.create({
          username: req.user.username,
          userId: req.user._id,
          leaderId: user2._id,
          status: 0,
          email: req.user.email
        })
        const subscriber = await this.userModel.findByIdAndUpdate(req.user._id, { $addToSet: { leaders: leaderId } })
        const subscriber2 = await this.userModel.findByIdAndUpdate(req.user._id, { $addToSet: { subScribing: leaderId } })

        const subscibing = await this.userModel.findByIdAndUpdate(leaderId, {
          $addToSet: { subScriber: { userId: user1._id, createTime: new Date(), status: 0 } }
        })
        let newData1 = { ...subscriber2.toObject() }
        delete newData1._id;
        let newData2 = { ...subscibing.toObject() }
        delete newData2._id
        await this.eventService.updateUser(subscriber2._id, newData1)
        await this.eventService.updateUser(subscibing._id, newData2)
        const updated = await this.userModel.findById(req.user._id)

        // await this.eventService.payToLeader({
        //   payer: user1,
        //   reciever: user2,
        //   amount: user2.subScriberFee
        // }, 0)
        return {
          message: 'subsCribing leader done!',
          statusCode: 200,
          data: { user: updated, walletAddress: '456456456', cost: user2.subScriberFee, subStatus: 1 }
        }
      } else {                                             //! if the request for leader subscribtion was exist...
        return {
          message: 'subsCribing leader done!',
          statusCode: 200,

        }
      }
    }
  }



}
