import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import mongoose, { Document } from 'mongoose';

// here i make the interface for user
export interface signalInterFace extends Document{
readonly status: number;
readonly leader : {id : string , username : string}
readonly TP: [string];
readonly signalName: string;
 symbol: string;
readonly openPrice: string;
readonly createdAt: string;
signalType : string;
positionType : string;  
firstLogo : string;
secondLogo:string;
update : boolean
// readonly gender: string;
// readonly TP : {profit1 : string , profit2 : string , profit3 : string}
}




@Schema({timestamps : true})
export class signal {

@Prop({type : String})
signalName : string

@Prop({type : Number})
timeLine : number;


@Prop({type : String})
symbol : string;


@Prop({type : String})
openPrice : string;


@Prop({type : String})
closePrice : string;


@Prop({type : String})
SL : string;


@Prop({type : [String]})
TP :  [string];


@Prop({type : String})
timeFrame : string;


@Prop({type : Number})
riskToReward : number;


@Prop({type : Number})
leverage : number;


@Prop({type : String})
picture : string;


@Prop({type : Object})
leader : {id : string , username : string , pictureProfile : string};


@Prop()
users : [string];


@Prop({type : Boolean , default : false})
cancel : boolean;


@Prop({type : Boolean , default:true})
isActive : boolean;


@Prop({type : Number , default : 0})          // 0 : active now   // 1 : active for future   // 2 : close and take profit  // 3 : close and stop loss   // 4: close by leader   5 : // deleted by leader
status:number

@Prop({type : String})          
firstLogo:string

@Prop({type : String})         
secondLogo:string

@Prop({type : String})
positionType : string;


@Prop({type : String})
description : string


@Prop({type : String})
signalType : string

@Prop({type : Boolean , default : false})
update : boolean


}



export const SignalSchema = SchemaFactory.createForClass(signal);