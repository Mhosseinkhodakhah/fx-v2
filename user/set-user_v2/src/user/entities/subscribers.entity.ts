import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
// import { time } from "console";
import mongoose, { Document } from 'mongoose';

// here i make the interface for user
export interface subsInterface extends Document {
    username : string;
    userId : string;
    leaderId : string;
    status : number;
    email : string;
    transActionId:string;
    plan : number;
}


@Schema({ timestamps: true })
export class subsCribers {
    @Prop()
    username : string;
    @Prop()
    userId : string;
    @Prop()
    leaderId : string;
    @Prop()
    status : number;
    @Prop()
    email : string;
    
    @Prop()
    transActionId : string;
    @Prop({type : Number})
    plan : number;

}

export const subScribers = SchemaFactory.createForClass(subsCribers);