import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import mongoose, { Document } from 'mongoose';

// here i make the interface for user
export interface walletInterFace extends Document{
    owner: mongoose.Types.ObjectId;
    balance: number;
    transActions: [string];
    incoming : number
    pending : number
}
   

@Schema({timestamps : true})
export class wallet{
    @Prop({type : mongoose.Schema.Types.ObjectId , ref : 'user'})
    owner : mongoose.Types.ObjectId
    
    @Prop({type : Number , default : 0})
    balance : number

    @Prop({type : Number , default : 0})
    pending : number

    @Prop({type : mongoose.Schema.Types.ObjectId , ref : 'transAction'})
    transActions:mongoose.Types.ObjectId[]                           //! it should test

    @Prop({type : Number , default : 0})
    incoming : number

}





export const WalletSchema = SchemaFactory.createForClass(wallet)
