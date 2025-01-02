import { IsEmail, IsNotEmpty, IsString } from "class-validator"



export class regisrtDto{
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email : string

    @IsNotEmpty()
    @IsString()
    password : string
}