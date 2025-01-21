import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) { }

  @Post('whithdraw/approve/:id')
  approveWithdraw(@Req() req: any, @Res() res: any, @Param('id') id: string) {
    return this.walletService.approveWithdrawall(req, res, id)
  }

  @Get('withdrawRequests')
  getWithdraw(@Req() req: any, @Res() res: any) {
    return this.walletService.getWithdraw(req, res)
  }
  
}
