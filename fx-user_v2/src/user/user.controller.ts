import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, Put, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { refreshTokenDTO } from './dto/refreshTokenDto.dto';
import { loginDto } from './dto/loginDto.dto';
import { regisrtDto } from './dto/registerDto.dto';
import { passwordBody } from './dto/passwordDto.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer'
import { extname } from 'path';



@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('/register')
  firstRegsiter(@Req() req: any, @Res() res: any, @Body() body: regisrtDto) {
    return this.userService.register(req, res, body)
  }



  @Patch('/otp/check/:code/:email')
  checlOtpCode(@Req() req : any , @Res() res : any , @Param('code') code : string , @Param('email') email : string){
    return this.userService.checkOtpCode(req , res , +code , email)
  }


  @Post('/login')
  loginUser(@Req() req: any, @Res() res: any, @Body() body: loginDto) {
    return this.userService.loginUser(req, res, body)
  }
  

  @Get('/forgetPassword/:userEmail')
  forgetPassword(@Req() req: any, @Res() res: any,@Param('userEmail') userEmail : string){
    return this.userService.forgetPassword(req , res , userEmail)
  }


  @Patch('/password/set/:userEmail')
  finalResetPassword(@Req() req:any, @Res() res:any , @Body() body : passwordBody , @Param('userEmail') userEmail : string){
    return this.userService.finalResetPasswor(req , res , body , userEmail)
  }


  @Patch('/resetPassword/:resetToken/:userEmail')
  resetPassword(@Param('resetToken') resetToken: string, @Param('userEmail') userEmail: string, @Req() req:any, @Res() res : any){
    return this.userService.resetPasswordWithToken(resetToken , userEmail , req , res)
  }

  @Put('/update')
  updateUser(@Req() req:any, @Res() res : any , @Body() body : any){
    return this.userService.updateUser(req , res , body)
  }


  @Post('upload/profile')
  @UseInterceptors(FileInterceptor('profile', {
    storage: diskStorage({
      destination: '/home/uploadedFiles/profiles'
      , filename: (req, file, cb) => {
        console.log(file)
        // Generating a 32 random chars long string
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
        //Calling the callback passing the random name generated with the original extension name
        cb(null, `${randomName}${extname(file.originalname)}`)
      }
    })
  }))
  async upload(@Req() req, @Res() res, @UploadedFile(
  ) profile) {
    // console.log()
    console.log(profile)
    console.log(req.user)
    return this.userService.uploadPictureProfile(req, res, profile.filename)
    // return profile
  }



  @Get('/info')
  getUserInfo(@Req() req: any, @Res() res: any) {
    return this.userService.getUserInfo(req, res)
  }


  @Get('/home/info')
  homePage(@Req() req: any, @Res() res: any) {
    return this.userService.getHomePageInfo(req , res)
  }

  @Get('/token/check')
  checkToken(@Req() req: any, @Res() res: any) {
    return this.userService.checkToken(req, res)
  }

  @Post('/token/refresh')
  refreshToken(@Req() req: any, @Res() res: any, @Body() body: refreshTokenDTO) {
    return this.userService.refreshToken(req, res, body)
  }


}
