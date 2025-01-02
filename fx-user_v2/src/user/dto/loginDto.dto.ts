import { IS_HASH, IsBoolean, IsHash, IsNotEmpty, IsNumber, IsString, MaxLength, isHash } from "class-validator";



export class loginDto{
    @IsNotEmpty()
    @IsString()
    email : string
    
    @IsNotEmpty()
    @IsString()
    password : string
}