import { Controller, Get, Param, Req, Res, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { ResponseInterceptor } from 'src/response/response.interceptor';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }


  @Get('/Explore')
  async getExploreData(@Req() req: any, @Res() res: any) {
    return this.userService.getExploreData(req, res)
  }

  @Get('/info')
  getUserInfo(@Req() req: any, @Res() res: any) {
    return this.userService.getUserInfo(req, res)
  }

  @Get('/home/info')
  homePage(@Req() req: any, @Res() res: any) {
    return this.userService.getHomePageInfo(req, res)
  }

  @Get('/branches')
  getLeaders(@Req() req: any, @Res() res: any) {
    return this.userService.usersBranches(req, res)
  }

  @Get('leader/:id')
  leader(@Req() req: any, @Res() res: any, @Param('id') leaderId: string) {
    return this.userService.getSpecificLeader(req, res, leaderId)
  }

  @Get('search/:search')
  search(@Req() req: any, @Res() res: any, @Param('search') search: string) {
    return this.userService.searcher(req, res, search)
  }

  @Get('user/:id')
  getSpecificUser(@Req() req: any, @Res() res: any, @Param('id') id: string) {
    return this.userService.getUser(req, res, id)
  }


}
