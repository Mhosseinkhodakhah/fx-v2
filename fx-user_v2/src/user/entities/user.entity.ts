import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
// import { time } from "console";
import mongoose, { Document } from 'mongoose';



// here i make the interface for user
export interface userInterFace extends Document {
    _id : any;
    role: number;
    email: string;
    password: string;
    code: number;
    autoExpand: boolean;
    suspend: boolean;
    username: string;
    subScriber: [],
    wallet: string,
    region: string,
    profile: string,
    firstName: string,
    tellegramId: string,
    broker: string,
    level: number,
    subScriberFee: number,
    resetPasswordToken :string,
    resetTokenExpire : string
    approvationData: object
    leaderRequestTime: string
    license: string
    readonly usingCode: boolean
    leaders: []
    discount :[]
    points : number
    readonly refreshToken : string
    readonly historyUser : [];
    readonly followings: { id: string }[]
    readonly followers: { id: string }[]
}




@Schema({ timestamps: true })
export class Student {
    //    @Prop()   
    //    name: string;   
    @Prop()
    email: string;

    @Prop()
    password: string;

    @Prop()
    refreshToken: string;

    @Prop({ type: Object })
    approvationData: {
        admin: { username: string, id: string },
        time: string
    }
    @Prop({ type: String })
    leaderRequestTime: string

    @Prop({ type: Number })
    role: number;                    // 0 : base user   // 1: completed user // 2 : base leader // 3 : approved leader   // 4 : rejected leader

    @Prop({ type: Number })
    status: number;         //  0 : just init   // 1: complete register  

    @Prop()
    code: number;

    @Prop({ type: String })
    license: string;

    @Prop({ type: Boolean, default: false })
    usingCode: boolean;

    @Prop()
    firstName: string;

    @Prop()
    lastName: string;

    @Prop()
    wallet: string;

    @Prop()
    Vwallet: string;

    @Prop()
    profile: string;

    @Prop()
    username: string;

    @Prop({ default: false, type: Boolean })
    approve: boolean;

    @Prop({ default: false, type: Boolean })
    suspend: boolean;

    @Prop()
    subScriber: [{ userId : string , createTime: string , status : number , plan : number }];  // 0 : pending , 1 : wait for transaction confirmed 2 : approve transaction 3 : reject transaction

    @Prop()
    historyUser: [{ userId: string , createTime: string }];

    @Prop()
    subScribing: [string];

    @Prop()
    followers : [string];

    @Prop()
    followings: [{ id : string }];

    @Prop()
    gender: string;

    @Prop()
    age: number;

    @Prop()
    region: string;

    @Prop()
    tellegramId: string;

    @Prop()
    points: number;

    @Prop()
    ticket: string;


    @Prop({ type: String, default: null })
    broker: [string]

    @Prop()
    history: [{ _id: string }];

    @Prop()
    seenSignals: [string];

    @Prop({ type: String, default: null })
    resetPasswordToken: string;

    @Prop({ type: String, default: null })
    resetTokenExpire: string;

    @Prop()                                            //{type : [mongoose.Schema.Types.ObjectId] , ref:Student}
    leaders : [string];

    @Prop({ type: Boolean, default: false })
    autoExpand: boolean
//{id : 1 , status : 0 , discount : 0 , active : true} , {id : 2 , status : 1 , discount : 0 , active : true} , {id : 3 , status : 2 , discount : 0 , active : true}
    @Prop({ default: [] })
    discount: [{id : number , status: number , discount : number , active : boolean }]   //status => 0 : 1 month    // 1 : two month   // 2 : 3 month

    @Prop({ type: Number, default: 0 })
    level: number                       // status => 0:

    @Prop({ type: Boolean })
    Active: boolean


    @Prop({ type: Number })
    subScriberFee : number
}

export const UserSchema = SchemaFactory.createForClass(Student);