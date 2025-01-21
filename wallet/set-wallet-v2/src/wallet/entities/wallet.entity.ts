import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import mongoose, { Document } from 'mongoose';

// here i make the interface for user
export interface walletInterFace extends Document {
    owner: {
        userName: string,
        email: string,
        role: number,
        profile: string,
        suspend: boolean,
        userId: string
    };
    balance: number;
    transActions:  mongoose.Types.ObjectId[]
    incoming: number
    pending: number
}


@Schema({ timestamps: true })
export class wallet {
    @Prop({ type: Object })
    owner: {
        userId: string,
        userName: string,
        email: string,
        role: number,
        profile: string,
        suspend: boolean
    }


    @Prop({ type: Number, default: 0 })
    balance: number

    @Prop({ type: Number, default: 0 })
    pending: number


    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'withdraw' })
    transActions: mongoose.Types.ObjectId[]                           //! it should test

    @Prop({ type: Number, default: 0 })
    incoming: number

}





export const WalletSchema = SchemaFactory.createForClass(wallet)
