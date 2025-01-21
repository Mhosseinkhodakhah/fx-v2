import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) { }


  @Get('getAllWallet')
  findAll(@Req() req, @Res() res) {
    return this.walletService.getAllWallets(req, res);
  }


  @Get('getSpecificWallet/:id')
  findOne(@Param('id') id: string, @Req() req, @Res() res) {
    return this.walletService.getSpecificWallet(req, res, +id);
  }


  @Get('leaderWallet')
  leaderWallet(@Req() req, @Res() res) {
    return this.walletService.getLeaderWallet(req, res);
  }



  @Get('withdrawRequests')
  getWithdraw(@Req() req, @Res() res) {
    return this.walletService.getWithdraw(req, res)
  }
}
