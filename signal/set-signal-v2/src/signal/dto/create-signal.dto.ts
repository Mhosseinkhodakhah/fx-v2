// import { ApiBody, ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IS_HASH, IsBoolean, IsEmpty, IsHash, IsNotEmpty, IsNumber, IsString, MaxLength, isHash } from "class-validator";

export class CreateSignalDto {
@IsNotEmpty()
@IsString()
symbol:string

@IsNotEmpty()
@IsString()
positionType:string

@IsNotEmpty()
@IsString()
timeFrame:string

@IsNotEmpty()
@IsString()
openPice:string

@IsNotEmpty()
@IsString()
closePrice:string

@IsNotEmpty()
@IsNumber()
leverage : number

@IsNotEmpty()
@IsString()
TP:string

@IsNotEmpty()
@IsString()
SL:string

@IsNotEmpty()
@IsNumber()
riskToReward:number

@IsNotEmpty()
@IsString()
picture:string

@IsNotEmpty()
@IsString()
description:string

signalName : string

signalType : string

leader : {}

firstLogo : string

secondLogo :string
}
