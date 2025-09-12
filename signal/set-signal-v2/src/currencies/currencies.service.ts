import { Injectable } from '@nestjs/common';

@Injectable()
export class CurrenciesService {


    constructor(){
        
    }


    async getAllCurrencies() {
        let apiToken = process.env.COINMARKETCAP
        let response = await fetch('https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
            headers: {
                'X-CMC_PRO_API_KEY': apiToken,
            },
        });
        console.log('resposne issss >>> ' , response)
        console.log('resposne issss >>> ' , await response.json())
    }

}
