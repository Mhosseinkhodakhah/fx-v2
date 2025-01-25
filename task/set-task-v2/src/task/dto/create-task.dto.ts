import { IsNotEmpty, IsNumber, IsString } from "class-validator"



export class CreateTaskDto {
    
    @IsNotEmpty()
    @IsString()
    title: string

    @IsNotEmpty()
    @IsString()
    description: string

    @IsNotEmpty()
    @IsString()
    link: string

    @IsNotEmpty()
    @IsNumber()
    points: number
}
