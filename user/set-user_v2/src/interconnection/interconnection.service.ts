import { Injectable } from '@nestjs/common';
import axios from 'axios';


@Injectable()
export class InterconnectionService {


    async getAllUserTransAction(userId : string):Promise<any>{
        const response = await axios.get(`http://localhost:4006/inter-api/transActions/all/${userId}`)
        console.log(response)
        return response.data;
    }


}
