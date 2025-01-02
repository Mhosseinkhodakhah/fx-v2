import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { refreshTokenDTO } from './dto/refreshTokenDto.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/info')
  getUserInfo(@Req() req : any , @Res() res:any){
    return this.userService.getUserInfo(req , res)
  }


  @Get('/token/check')
  checkToken(@Req() req : any , @Res() res:any){
    return this.userService.checkToken(req , res)
  }

  @Post('/token/refresh')
  refreshToken(@Req() req : any , @Res() res:any , @Body() body : refreshTokenDTO){
    return this.userService.refreshToken(req , res , body)
  }

}
