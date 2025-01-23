import mongoose from 'mongoose'



export default async () => {
    mongoose.connect('').then(()=>{
        console.log('database connected successfully . . .')
    }).catch((err)=>{
        console.log('connecting to database failed . . .>>>>>' , `${err}`)
    })
}