import { model, Schema } from "mongoose";


export interface signalInterFace {
    signalName: string

    timeLine: number

    symbol: string

    openPrice: string

    closePrice: string

    SL: string

    TP: string[],

    timeFrame: string

    riskToReward: number

    leverage: number

    picture: string

    leader: { id: string, username: string, pictureProfile: string },

    users: string[],

    cancel: boolean

    isActive: boolean

    status: number

    firstLogo: string

    secondLogo: string

    positionType: string

    description: string

    signalType: string

    update: boolean
}




const signalSchema = new Schema<signalInterFace>({

    signalName: { type: String },

    timeLine: { type: Number },

    symbol: { type: String },

    openPrice: { type: String },

    closePrice: { type: String },

    SL: { type: String },

    TP: { type: [String] },

    timeFrame: { type: String },

    riskToReward: { type: Number },

    leverage: { type: Number },

    picture: { type: String },

    leader: { id: { type: String }, username: { type: String }, pictureProfile: { type: String } },

    users: { type: [String] },

    cancel: { type: Boolean, default: false },

    isActive: { type: Boolean, default: true },

    status: { type: Number, default: 0 },

    firstLogo: { type: String },

    secondLogo: { type: String },

    positionType: { type: String },

    description: { type: String },

    signalType: { type: String },

    update: { type: Boolean, default: false }

})


export const signalModel = model<signalInterFace>('signal', signalSchema)