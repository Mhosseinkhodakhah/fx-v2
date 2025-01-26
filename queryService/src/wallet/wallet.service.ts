import { Injectable } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { walletInterFace } from './entities/wallet.entity';
import { withdrawInterFace } from './entities/withdraw.entity';
import { transActionInterFace } from './entities/trans-action.entity';
import { RedisHandlerService } from 'src/redis-handler/redis-handler.service';

@Injectable()
export class WalletService {


  constructor(@InjectModel('wallet') private walletModel: Model<walletInterFace>,
    @InjectModel('withdraw') private withdrawal: Model<withdrawInterFace>,
    @InjectModel('transAction') private TransAction: Model<transActionInterFace>,
    private readonly cacheManager : RedisHandlerService
  ) {}


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
    let cacheData = await this.cacheManager.get('getAllWallets')
    if (cacheData){
      return{
        message : 'geting all wallets done!',
        statusCode : 200,
        length : cacheData.length,
        data : cacheData
      }
    }
    this.walletModel.find().then(async(resault) => {
      this.cacheManager.set('getAllWallets' , resault)
      return{
        message : 'geting all wallets done!',
        statusCode : 200,
        length : resault.length,
        data : resault
      }
    }).catch((err) => {
      return {
        message : 'getting all wallets failed!',
        statusCode : 500,
        error : `${err}`
      }
    })
  }

  async getSpecificWallet(req, res, id: number) {
    let cacheData = await this.cacheManager.get(`getSpecificWallet-${req.user._id}`)
    if (cacheData){
      return {
        message : 'get specific wallet done!',
        statusCode : 200,
        data : cacheData
      }
    }
    this.walletModel.findById(id).then(async(resault) => {
    this.cacheManager.set(`getSpecificWallet-${req.user._id}` , resault).then(()=>{
      console.log('cache heat successfully done')
    })
      return {
        message : 'get specific wallet done!',
        statusCode : 200,
        data : resault
      }
    }).catch((err) => {
      return {
        statusCode : 500,
        message : 'get specific wallet failed!',
        error : `${err}`
      }
    })
  }


  async getLeaderWallet(req, res) {
    let cacheData = await this.cacheManager.get(`getLeaderWallet-${req.user._id}`)
    if (cacheData){
      return {
        message : 'get leader wallet done!',
        statusCode : 200,
        data : {
          wallet : cacheData.wallet,
          transAction : cacheData.transAction
        }
      }
    }
    const wallet = await this.walletModel.findById(req.user._id)
    const transAction = await this.TransAction.find({ $or: [{ 'payer.userId': req.user._id }, { 'receiver.userId': req.user._id }] })
    this.cacheManager.set(`getLeaderWallet-${req.user._id}` , {wallet : wallet , transAction : transAction}).then(()=>{
      console.log('cache heat successfully done.')
    })
    return {
      statusCode : 200,
      message : 'get leader wallet done!',
      data : {
        wallet : wallet,
        transAction : transAction
      }
    }
  }

  async getWithdraw(req:any, res:any) {
    let cacheData = await this.cacheManager.get(`getWithdraw-${req.user._id}`)
    if (cacheData){
      return {
        message : 'getting all withdrawal requests done!',
        statusCode : 200,
        data : cacheData
      }
    }
    const pendings = await this.withdrawal.find({ $and: [{ status: 0 }, { 'receiver.userId': req.user._id }] }).sort({ 'createdAt': -1 })
    const approved = await this.withdrawal.find({ $and: [{ status: 1 }, { 'receiver.userId': req.user._id }] }).sort({ 'createdAt': -1 })
    const failed = await this.withdrawal.find({ $and: [{ status: 2 }, { 'receiver.userId': req.user._id }] }).sort({ 'createdAt': -1 })
    this.cacheManager.set(`getWithdraw-${req.user._id}`,{
      pendings: pendings,
      approved: approved,
      failed: failed
    }).then(()=>[
      console.log('cache heat done.')
    ])
    return {
      message : 'getting all withdrawal requests done!',
      statusCode : 200,
      data : {
        pendings: pendings,
        approved: approved,
        failed: failed
      }
    }
  }


}
