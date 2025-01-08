import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import mongoose, { Document, mongo } from 'mongoose';



export interface withdrawInterFace extends Document{
    payerAdmin: mongoose.Types.ObjectId
    
    receiver : mongoose.Types.ObjectId
    
    payMentReason : number
    status : number
    amount : number
}


@Schema({timestamps : true})
export class withdraw{
    @Prop({type : mongoose.Schema.Types.ObjectId , ref : 'user'})
    payerAdmin : mongoose.Types.ObjectId
    
    @Prop({type : mongoose.Schema.Types.ObjectId , ref : 'user'})
    receiver : mongoose.Types.ObjectId
    
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