import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';



export interface responseInterface{
    success : boolean;
    message : string;
    data : any;
    error : any;
    timestamp : string
}




@Injectable()
export class InterconnectionService {

    async reqForGetUser(userId : string) : Promise<Partial<responseInterface>>{
        const rawResponse = await fetch(`http://localhost:9012/user/user/${userId}` , {method : 'GET'})
        const response : Partial<responseInterface> = await rawResponse.json()
        return response;
    }


}
