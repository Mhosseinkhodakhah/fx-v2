import { IsEmail, IsNotEmpty, IsString } from "class-validator"
import { Transform, Type } from 'class-transformer';


export class regisrtDto{
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email : string

    @IsNotEmpty()
    @IsString()
    password : string
}