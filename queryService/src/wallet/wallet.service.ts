import { Injectable } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { walletInterFace } from './entities/wallet.entity';
import { withdrawInterFace } from './entities/withdraw.entity';
import { transActionInterFace } from './entities/trans-action.entity';

@Injectable()
export class WalletService {


  constructor(@InjectModel('wallet') private walletModel: Model<walletInterFace>,
    @InjectModel('withdraw') private withdrawal: Model<withdrawInterFace>,
    @InjectModel('TransAction') private TransAction: Model<transActionInterFace>) {}


  async createWallet(req : any, res:any, request) {
    const userData = {
      owner: {
        userName: req.user.username,
        email: req.user.email,
        role: req.user.role,
        profile: req.user.profile,
        suspend: false,
      }
    }
    new this.walletModel(userData).save().then((resault) => {
      return {
        message : 'creating wallet successfully done!!',
        data : resault
      }

    }).catch((err) => {
      return{
        message : 'creating wallet failed beacuse of the database connection failed!!',
        error : `${err}`
      }
    })
  }

  async getAllWallets(req, res) {
    this.walletModel.find().then((resault) => {
      return{
        message : 'geting all wallets done!',
        length : resault.length,
        data : resault
      }
    }).catch((err) => {
      return {
        message : 'getting all wallets failed!',
        error : `${err}`
      }
    })
  }

  async getSpecificWallet(req, res, id: number) {
    this.walletModel.findById(id).then((resault) => {
      return {
        message : 'get specific wallet done!',
        data : resault
      }
    }).catch((err) => {
      return {
        message : 'get specific wallet failed!',
        error : `${err}`
      }
    })
  }


  async getLeaderWallet(req, res) {
    console.log('fff', req.user)
    const wallet = await this.walletModel.findById(req.user._id)
    const transAction = await this.TransAction.find({ $or: [{ 'payer.userId': req.user._id }, { 'receiver.userId': req.user._id }] })
    return {
      message : 'get leader wallet done!',
      data : {
        wallet : wallet,
        transAction : transAction
      }
    }
  }

  async getWithdraw(req:any, res:any) {
    const pendings = await this.withdrawal.find({ $and: [{ status: 0 }, { 'receiver.userId': req.user._id }] }).sort({ 'createdAt': -1 })
    const approved = await this.withdrawal.find({ $and: [{ status: 1 }, { 'receiver.userId': req.user._id }] }).sort({ 'createdAt': -1 })
    const failed = await this.withdrawal.find({ $and: [{ status: 2 }, { 'receiver.userId': req.user._id }] }).sort({ 'createdAt': -1 })
    return {
      message : 'getting all withdrawal requests done!',
      data : {
        pendings: pendings,
        approved: approved,
        failed: failed
      }
    }
  }


}
