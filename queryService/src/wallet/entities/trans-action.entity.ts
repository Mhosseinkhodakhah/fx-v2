import { Prop, Schema , SchemaFactory } from "@nestjs/mongoose"
import mongoose, { Document } from 'mongoose';


export interface transActionInterFace extends Document{
    
    payer:mongoose.Types.ObjectId

    receiver : mongoose.Types.ObjectId
    
    payMentReason : number
    status : number
    amount : number
}
   

@Schema({timestamps : true})
export class transAction{
    @Prop({type : mongoose.Schema.Types.ObjectId , ref : 'user'})
    payer : mongoose.Types.ObjectId

    @Prop({type : mongoose.Schema.Types.ObjectId})
    receiver : mongoose.Types.ObjectId

    @Prop({type : Number})
    payMentReason : number           // 0: pay to leader   // 1:  withdrawal   // 2: comision    // 3 : 
    
    @Prop({type : Number})
    status : number                 // 0 : success   // 1 : canceled   // 2 : set manulay by admin // 3 : pending 

    @Prop({type : Number})
    amount : number
}



export const TransActionSchema = SchemaFactory.createForClass(transAction)