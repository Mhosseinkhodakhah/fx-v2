import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import mongoose, { Document } from 'mongoose';




export interface withdrawInterFace extends Document{
    readonly payerAdmin: {
        userName : string,
        profilePicture : string,
        userId : string,
    };
    
    readonly receiver : {
        userName : string,
        walletId : string,
        userId : string,
        profilePicture : string,
        role : string
    }
    
    readonly payMentReason : number
    readonly status : number
    readonly amount : number
}


@Schema({timestamps : true})
export class withdraw{
    @Prop({type : Object})
    payerAdmin : {
        userName : string,
        
        profilePicture : string,
        
        userId : string,
    }
    
    @Prop({type : Object})
    receiver : {
        userName : string,
        walletId : string,
        userId : string,
        profilePicture : string,
        role : string
    }
    
    @Prop({type : String})
    payMentReason : string           // 0: pay to leader   // 1:  withdrawal   // 2: comision    // 3 : 
    
    @Prop({type : Number})
    status : number                 // 0 : pending   // 1 : done
    
    @Prop({type : Number})
    amount : number
    
    @Prop({type : String})
    address : string
}




export const Withdraw = SchemaFactory.createForClass(withdraw)