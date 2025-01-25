import { Prop, Schema, SchemaFactory, raw } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export interface storyInterface extends Document {
    user: {
        username: string,
        userId: string,
        profile: string,
    }

    // mainId : string

    url: string

    seenStory: string[]

    likes : string[]

    typeStory: string

    activeStory: boolean
    
    deleted : boolean

}


@Schema({ timestamps: true })
export class Story {

    @Prop({type : {}})
    user: {
        username: string,
        userId: string,
        profile: string,
    }

    // @Prop({type : String})
    // mainId : string

    @Prop({ type: String, required: true })
    url: string


    @Prop({ type: [String] , default : [] })
    seenStory: string[]

    @Prop({ type: String })
    typeStory: string

    @Prop({ type: Boolean , default : true})
    activeStory: boolean

    @Prop({type : Boolean , default : false})
    deleted : boolean


    @Prop({type : [String]})
    likes : string[]



    /*
    @Prop(raw([
        {
            good_name: String,
            good_price: Number,
            good_amount: Number
        }
    ]))
    obj_items: Record<string,any>[]
    */
    // 👆 this transform to this 👇 (OneToMany relation)
    // @Prop({type:[
    //     {type: mongoose.Types.ObjectId, ref: 'InvoiceItem'}
    // ]})
    // obj_items: [InvoiceItem]

}


export const storySchema = SchemaFactory.createForClass(Story);



