import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable , OnModuleInit } from '@nestjs/common';
import { Cache } from 'cache-manager';
import * as WebSocket from "ws";
import * as SocketIoClient from 'socket.io-client';

@Injectable()
export class CurrenciesService {

    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {}


    async getAllCurrencies() {
        
        // const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');

        // ws.onmessage = (event) => {
        //     const data = JSON.parse(event.data);
        //     console.log('قیمت لحظهای:', data.p);
        // };

        //  const client = SocketIoClient("http://localhost:3000")
        
        const symbols = {
            "BTC": "https://s2.coinmarketcap.com/static/img/coins/64x64/1.png", "ETH": "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png", "USDT": "https://s2.coinmarketcap.com/static/img/coins/64x64/825.png", "BNB": "https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png", "SOL": "https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png", "USDC": "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png", "XRP": "https://s2.coinmarketcap.com/static/img/coins/64x64/52.png", "TON": "https://s2.coinmarketcap.com/static/img/coins/64x64/11419.png", "DOGE": "https://s2.coinmarketcap.com/static/img/coins/64x64/74.png", "ADA": "https://s2.coinmarketcap.com/static/img/coins/64x64/2010.png", "TRX": "https://s2.coinmarketcap.com/static/img/coins/64x64/1958.png", "AVAX": "https://s2.coinmarketcap.com/static/img/coins/64x64/5805.png", "SHIB": "https://s2.coinmarketcap.com/static/img/coins/64x64/5994.png", "DOT": "https://s2.coinmarketcap.com/static/img/coins/64x64/6636.png", "LINK": "https://s2.coinmarketcap.com/static/img/coins/64x64/1975.png", "BCH": "https://s2.coinmarketcap.com/static/img/coins/64x64/1831.png", "DAI": "https://s2.coinmarketcap.com/static/img/coins/64x64/4943.png", "LEO": "https://s2.coinmarketcap.com/static/img/coins/64x64/3957.png", "NEAR": "https://s2.coinmarketcap.com/static/img/coins/64x64/6535.png", "MATIC": "https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png", "UNI": "https://s2.coinmarketcap.com/static/img/coins/64x64/7083.png",
            "LTC": "https://s2.coinmarketcap.com/static/img/coins/64x64/2.png", "KAS": "https://s2.coinmarketcap.com/static/img/coins/64x64/20396.png", "PEPE": "https://s2.coinmarketcap.com/static/img/coins/64x64/24478.png", "ICP": "https://s2.coinmarketcap.com/static/img/coins/64x64/8916.png", "FET": "https://s2.coinmarketcap.com/static/img/coins/64x64/3773.png", "ETC": "https://s2.coinmarketcap.com/static/img/coins/64x64/1321.png", "XMR": "https://s2.coinmarketcap.com/static/img/coins/64x64/328.png", "APT": "https://s2.coinmarketcap.com/static/img/coins/64x64/21794.png", "XLM": "https://s2.coinmarketcap.com/static/img/coins/64x64/512.png", "RNDR": "https://s2.coinmarketcap.com/static/img/coins/64x64/5690.png", "HBAR": "https://s2.coinmarketcap.com/static/img/coins/64x64/4642.png", "ATOM": "https://s2.coinmarketcap.com/static/img/coins/64x64/3794.png", "CRO": "https://s2.coinmarketcap.com/static/img/coins/64x64/3635.png", "OKB": "https://s2.coinmarketcap.com/static/img/coins/64x64/3897.png",
            "MNT": "https://s2.coinmarketcap.com/static/img/coins/64x64/27075.png", "MKR": "https://s2.coinmarketcap.com/static/img/coins/64x64/1518.png", "STX": "https://s2.coinmarketcap.com/static/img/coins/64x64/4847.png", "FIL": "https://s2.coinmarketcap.com/static/img/coins/64x64/2280.png", "ARB": "https://s2.coinmarketcap.com/static/img/coins/64x64/11841.png", "WIF": "https://s2.coinmarketcap.com/static/img/coins/64x64/28752.png", "IMX": "https://s2.coinmarketcap.com/static/img/coins/64x64/10603.png", "VET": "https://s2.coinmarketcap.com/static/img/coins/64x64/3077.png", "FDUSD": "https://s2.coinmarketcap.com/static/img/coins/64x64/26081.png", "INJ": "https://s2.coinmarketcap.com/static/img/coins/64x64/7226.png", "GRT": "https://s2.coinmarketcap.com/static/img/coins/64x64/6719.png", "SUI": "https://s2.coinmarketcap.com/static/img/coins/64x64/20947.png", "TAO": "https://s2.coinmarketcap.com/static/img/coins/64x64/22974.png", "BONK": "https://s2.coinmarketcap.com/static/img/coins/64x64/23095.png", "OP": "https://s2.coinmarketcap.com/static/img/coins/64x64/11840.png", "AR": "https://s2.coinmarketcap.com/static/img/coins/64x64/5632.png", "LDO": "https://s2.coinmarketcap.com/static/img/coins/64x64/8000.png", "BGB": "https://s2.coinmarketcap.com/static/img/coins/64x64/11092.png", "ONDO": "https://s2.coinmarketcap.com/static/img/coins/64x64/21159.png", "FLOKI": "https://s2.coinmarketcap.com/static/img/coins/64x64/10804.png", "THETA": "https://s2.coinmarketcap.com/static/img/coins/64x64/2416.png", "FTM": "https://s2.coinmarketcap.com/static/img/coins/64x64/3513.png", "AAVE": "https://s2.coinmarketcap.com/static/img/coins/64x64/7278.png", "BRETT": "https://s2.coinmarketcap.com/static/img/coins/64x64/29743.png", "RUNE": "https://s2.coinmarketcap.com/static/img/coins/64x64/4157.png", "JASMY": "https://s2.coinmarketcap.com/static/img/coins/64x64/8425.png", "NOT": "https://s2.coinmarketcap.com/static/img/coins/64x64/28850.png", "ALGO": "https://s2.coinmarketcap.com/static/img/coins/64x64/4030.png", "JUP": "https://s2.coinmarketcap.com/static/img/coins/64x64/29210.png", "PYTH": "https://s2.coinmarketcap.com/static/img/coins/64x64/28177.png", "TIA": "https://s2.coinmarketcap.com/static/img/coins/64x64/22861.png", "EGLD": "https://s2.coinmarketcap.com/static/img/coins/64x64/6892.png", "FLR": "https://s2.coinmarketcap.com/static/img/coins/64x64/7950.png", "QNT": "https://s2.coinmarketcap.com/static/img/coins/64x64/3155.png", "SEI": "https://s2.coinmarketcap.com/static/img/coins/64x64/23149.png", "KCS": "https://s2.coinmarketcap.com/static/img/coins/64x64/2087.png", "CORE": "https://s2.coinmarketcap.com/static/img/coins/64x64/23254.png", "AKT": "https://s2.coinmarketcap.com/static/img/coins/64x64/7431.png", "FLOW": "https://s2.coinmarketcap.com/static/img/coins/64x64/4558.png", "DYDX": "https://s2.coinmarketcap.com/static/img/coins/64x64/28324.png", "STRK": "https://s2.coinmarketcap.com/static/img/coins/64x64/22691.png", "ENS": "https://s2.coinmarketcap.com/static/img/coins/64x64/13855.png", "AXS": "https://s2.coinmarketcap.com/static/img/coins/64x64/6783.png", "EOS": "https://s2.coinmarketcap.com/static/img/coins/64x64/1765.png", "BTT": "https://s2.coinmarketcap.com/static/img/coins/64x64/16086.png", "USDD": "https://s2.coinmarketcap.com/static/img/coins/64x64/19891.png", "XTZ": "https://s2.coinmarketcap.com/static/img/coins/64x64/2011.png", "BEAM": "https://s2.coinmarketcap.com/static/img/coins/64x64/28298.png", "OM": "https://s2.coinmarketcap.com/static/img/coins/64x64/6536.png", "BSV": "https://s2.coinmarketcap.com/static/img/coins/64x64/3602.png", "GALA": "https://s2.coinmarketcap.com/static/img/coins/64x64/7080.png", "NEO": "https://s2.coinmarketcap.com/static/img/coins/64x64/1376.png", "SAND": "https://s2.coinmarketcap.com/static/img/coins/64x64/6210.png", "ENA": "https://s2.coinmarketcap.com/static/img/coins/64x64/30171.png", "GT": "https://s2.coinmarketcap.com/static/img/coins/64x64/4269.png", "GNO": "https://s2.coinmarketcap.com/static/img/coins/64x64/1659.png", "ORDI": "https://s2.coinmarketcap.com/static/img/coins/64x64/25028.png", "SAFE": "https://s2.coinmarketcap.com/static/img/coins/64x64/21585.png", "ZK": "https://s2.coinmarketcap.com/static/img/coins/64x64/24091.png", "XEC": "https://s2.coinmarketcap.com/static/img/coins/64x64/10791.png", "NEXO": "https://s2.coinmarketcap.com/static/img/coins/64x64/2694.png", "PENDLE": "https://s2.coinmarketcap.com/static/img/coins/64x64/9481.png", "MANA": "https://s2.coinmarketcap.com/static/img/coins/64x64/1966.png", "CHZ": "https://s2.coinmarketcap.com/static/img/coins/64x64/4066.png"
        }
        let allData: {}[] = []
        let currencies = 'bitcoin, ethereum, tether, binance coin, usd coin, ripple, cardano, dogecoin, solana, polkadot, shiba inu, litecoin, chainlink, stellar, bitcoin cash, monero, avalanche, polygon, uniswap, cosmos'
    //     for (let i of Object.keys(symbols)) {
    //         currencies+=`${i},`
    //     //     if (rawRespones.status == 200){
    //     //         const mainRes = await rawRespones.json()
    //     //         if (mainRes&& mainRes.RAW && mainRes.RAW[i] && mainRes.RAW[i].USD){
    //     //             let mainData = mainRes.RAW[i].USD
    //     //             allData.push({
    //     //                 price: mainData.PRICE,
    //     //                 lastVolume: mainData.LASTVOLUME,
    //     //                 OPENHOUR: mainData.OPENHOUR,
    //     //                 HIGHHOUR: mainData.HIGHHOUR,
    //     //                 LOWHOUR: mainData.LOWHOUR,
    //     //                 CHANGEHOUR: mainData.CHANGEHOUR,
    //     //                 imgUrl: symbols[i]
    //     //             })
    //     //             console.log('log after getting data from thirdparty service' , mainData.RAW[i].USD)
    //     //         }else{
    //     //             console.log('second cond is failed')
    //     //         }
    //     //         console.log('first cond is failed')
    //     //     }

    // }
        const rawRespones = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${currencies}&vs_currencies=usd`, { method: 'GET' });
        let newResponse = await rawRespones.json()
        console.log('raw response' , newResponse)
        for (let i of Object.keys(newResponse)) {
            allData.push(
                {
                    symbol: i,
                    price: newResponse[i].usd,
                    lastVolume: 1,
                    OPENHOUR: 1,
                    HIGHHOUR: 1,
                    LOWHOUR: 1,
                    CHANGEHOUR: 1,
                    imgUrl: symbols[i]
                }
            )
        }
        await this.cacheManager.set('currencies', allData)
    }

}
