import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { refreshTokenDTO } from './dto/refreshTokenDto.dto';
import { loginDto } from './dto/loginDto.dto';
import { regisrtDto } from './dto/registerDto.dto';




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


  @Get('/info')
  getUserInfo(@Req() req: any, @Res() res: any) {
    return this.userService.getUserInfo(req, res)
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
