import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import mongoose, { Document } from 'mongoose';


export interface transActionInterFace extends Document {
    readonly payer: {
        userName: string,
        walletId: string,
        profilePicture: string,
        role: number,
        userId: string,
    };

    readonly receiver: {
        userName: string,
        walletId: string,
        userId: string,
        profilePicture: string,
        role: string
    }

    readonly payMentReason: number
    readonly status: number
    readonly amount: number
}


@Schema({ timestamps: true })
export class transAction {
    @Prop({ type: Object })
    payer: {
        userName: string,
        walletId: string,
        profilePicture: string,
        role: number,
        userId: string,
    }

    @Prop({ type: Object })
    receiver: {
        userName: string,
        walletId: string,
        userId: string,
        profilePicture: string,
        role: string
    }

    @Prop({ type: Number })
    payMentReason: number           // 0: pay to leader   // 1:  withdrawal   // 2: comision    // 3 : 

    @Prop({ type: Number })
    status: number                 // 0 : success   // 1 : canceled   // 2 : set manulay by admin // 3 : pending 

    @Prop({ type: Number })
    amount: number
}



export const TransAction = SchemaFactory.createForClass(transAction)