import { Injectable } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { walletInterFace } from './entities/wallet.entity';
import { withdrawInterFace } from './entities/withdraw.entity';

@Injectable()
export class WalletService {
  

  constructor(@InjectModel('wallet') private walletModel : Model<walletInterFace> , @InjectModel('withdraw') private withdrawal : Model<withdrawInterFace>){}


  async approveWithdrawall(req:any , res:any , id:string){
    const request = await this.withdrawal.findByIdAndUpdate(id , {status : 1 , payerAdmin : {
      username : req.user.username,
      userId : req.user._id,
      pictureProfile : req.user.profile
    }})
    const wallet = await this.walletModel.findOne({'owner.userId' : request.receiver.userId})
    await this.walletModel.findOneAndUpdate({'owner.userId' : request.receiver.userId} , {pending : (wallet.pending - request.amount)})
    

    return {
      message : 'approving withdraw request by admin done',
    }
  }


  async getWithdraw(req : any, res : any){
    const pendings = await this.withdrawal.find({$and : [{status : 0} , {'receiver.userId' : req.user._id}]} ).sort({'createdAt' : -1})
    const approved = await this.withdrawal.find({$and : [{status : 1} , {'receiver.userId' : req.user._id}]}).sort({'createdAt' : -1})
    const failed = await this.withdrawal.find({$and : [{status : 2} , {'receiver.userId' : req.user._id}]}).sort({'createdAt' : -1})
    return res.status(200).json({
      success : true,
        data : {
          pendings : pendings,
          approved : approved,
          failed:failed
        },
        error : '',
        scope : 'geting all withdraw requests',
    })
  }

}
