import { Inject, Injectable } from '@nestjs/common';
import { CreateSocektDto } from './dto/create-socekt.dto';
import { UpdateSocektDto } from './dto/update-socekt.dto';
import { Socket } from 'socket.io';
import { WebSocketServer } from '@nestjs/websockets';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Mongoose } from 'mongoose';
import { signalInterFace } from 'src/signal/entities/signal.entity';
import { InterconnectionService } from 'src/interconnection/interconnection.service';
const jwt = require('jsonwebtoken')
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';


@Injectable()
export class SocektService {
  @InjectModel('signal') private signalModel: Model<signalInterFace>
  private readonly queryService: InterconnectionService
  private readonly connectedClients: Map<string, Socket> = new Map();
  private readonly socketService: SocektService
  @WebSocketServer() private server: Socket;
  @Inject(CACHE_MANAGER) private cacheManager: Cache



  /**
  * its when user connecting to server at first and we get user data from query service and cache it and validate users token here
  * @param socket 
  * @returns 
  */
  async handleConnection(socket: Socket) {
    const clientId = socket.id;
    console.log('connection successfull')
    const token = socket.handshake.headers.authorization
    let tokenVerification = await this.#checkToken(token)

    if (!tokenVerification) {
      return this.server.to(socket.id).emit('allSignals', { error: 'token Expired!' })
    }

    const userData = await this.queryService.reqForGetUser(tokenVerification._id)
    if (!userData.success) {
      return this.server.to(socket.id).emit('allSignals', { error: 'token Expired!' })
    }
    this.connectedClients.set(socket.id, userData.data)

    socket.on('disconnect', () => {
      console.log('user disconnected', clientId)
      this.connectedClients.delete(clientId);
      console.log(this.connectedClients)
    })
  }



  /**
   * this function is for getting news for first page
   * @returns the all news in the custom form
   */
  async #getNews() {
    const news = await fetch('https://min-api.cryptocompare.com/data/v2/news/?lang=EN&api_key=e41af537fc81ded20a82b3a025c2923b6a6db4dda1ea05ee53e8be2d162a3fad', { method: 'GET' })
    const allData = await news.json()
    // console.log('allll' , allData)
    let allNews = []
    allData.Data.forEach(elem => {
      let data = {
        title: elem?.title,
        body: elem?.body,
        image: elem?.imageurl,
        category: elem?.categories,
        resourceImage: elem?.source_info?.img,
        resourceName: elem?.source_info?.name,
        resourceUrl: elem?.url,
        publishTime: elem?.published_on
      }
      allNews.push(data)
    })

    // console.log('all news' , allNews.length)
    return allNews
  }




  /**
   * this function is for getting the price of the cryptos for home page
   * @returns the first price for home page
   */
  async #firsData() {
    {                 // starter for the signal tracer every minutes
      console.log('testify')
      const symbols = {
        "BTC": "https://s2.coinmarketcap.com/static/img/coins/64x64/1.png", "ETH": "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png", "USDT": "https://s2.coinmarketcap.com/static/img/coins/64x64/825.png", "BNB": "https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png", "SOL": "https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png", "USDC": "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png", "XRP": "https://s2.coinmarketcap.com/static/img/coins/64x64/52.png", "TON": "https://s2.coinmarketcap.com/static/img/coins/64x64/11419.png", "DOGE": "https://s2.coinmarketcap.com/static/img/coins/64x64/74.png", "ADA": "https://s2.coinmarketcap.com/static/img/coins/64x64/2010.png", "TRX": "https://s2.coinmarketcap.com/static/img/coins/64x64/1958.png", "AVAX": "https://s2.coinmarketcap.com/static/img/coins/64x64/5805.png", "SHIB": "https://s2.coinmarketcap.com/static/img/coins/64x64/5994.png", "DOT": "https://s2.coinmarketcap.com/static/img/coins/64x64/6636.png", "LINK": "https://s2.coinmarketcap.com/static/img/coins/64x64/1975.png", "BCH": "https://s2.coinmarketcap.com/static/img/coins/64x64/1831.png", "DAI": "https://s2.coinmarketcap.com/static/img/coins/64x64/4943.png", "LEO": "https://s2.coinmarketcap.com/static/img/coins/64x64/3957.png", "NEAR": "https://s2.coinmarketcap.com/static/img/coins/64x64/6535.png", "MATIC": "https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png", "UNI": "https://s2.coinmarketcap.com/static/img/coins/64x64/7083.png",
        "LTC": "https://s2.coinmarketcap.com/static/img/coins/64x64/2.png", "KAS": "https://s2.coinmarketcap.com/static/img/coins/64x64/20396.png", "PEPE": "https://s2.coinmarketcap.com/static/img/coins/64x64/24478.png", "ICP": "https://s2.coinmarketcap.com/static/img/coins/64x64/8916.png", "FET": "https://s2.coinmarketcap.com/static/img/coins/64x64/3773.png", "ETC": "https://s2.coinmarketcap.com/static/img/coins/64x64/1321.png", "XMR": "https://s2.coinmarketcap.com/static/img/coins/64x64/328.png", "APT": "https://s2.coinmarketcap.com/static/img/coins/64x64/21794.png", "XLM": "https://s2.coinmarketcap.com/static/img/coins/64x64/512.png", "RNDR": "https://s2.coinmarketcap.com/static/img/coins/64x64/5690.png", "HBAR": "https://s2.coinmarketcap.com/static/img/coins/64x64/4642.png", "ATOM": "https://s2.coinmarketcap.com/static/img/coins/64x64/3794.png", "CRO": "https://s2.coinmarketcap.com/static/img/coins/64x64/3635.png", "OKB": "https://s2.coinmarketcap.com/static/img/coins/64x64/3897.png",
        "MNT": "https://s2.coinmarketcap.com/static/img/coins/64x64/27075.png", "MKR": "https://s2.coinmarketcap.com/static/img/coins/64x64/1518.png", "STX": "https://s2.coinmarketcap.com/static/img/coins/64x64/4847.png", "FIL": "https://s2.coinmarketcap.com/static/img/coins/64x64/2280.png", "ARB": "https://s2.coinmarketcap.com/static/img/coins/64x64/11841.png", "WIF": "https://s2.coinmarketcap.com/static/img/coins/64x64/28752.png", "IMX": "https://s2.coinmarketcap.com/static/img/coins/64x64/10603.png", "VET": "https://s2.coinmarketcap.com/static/img/coins/64x64/3077.png", "FDUSD": "https://s2.coinmarketcap.com/static/img/coins/64x64/26081.png", "INJ": "https://s2.coinmarketcap.com/static/img/coins/64x64/7226.png", "GRT": "https://s2.coinmarketcap.com/static/img/coins/64x64/6719.png", "SUI": "https://s2.coinmarketcap.com/static/img/coins/64x64/20947.png", "TAO": "https://s2.coinmarketcap.com/static/img/coins/64x64/22974.png", "BONK": "https://s2.coinmarketcap.com/static/img/coins/64x64/23095.png", "OP": "https://s2.coinmarketcap.com/static/img/coins/64x64/11840.png", "AR": "https://s2.coinmarketcap.com/static/img/coins/64x64/5632.png", "LDO": "https://s2.coinmarketcap.com/static/img/coins/64x64/8000.png", "BGB": "https://s2.coinmarketcap.com/static/img/coins/64x64/11092.png", "ONDO": "https://s2.coinmarketcap.com/static/img/coins/64x64/21159.png", "FLOKI": "https://s2.coinmarketcap.com/static/img/coins/64x64/10804.png", "THETA": "https://s2.coinmarketcap.com/static/img/coins/64x64/2416.png", "FTM": "https://s2.coinmarketcap.com/static/img/coins/64x64/3513.png", "AAVE": "https://s2.coinmarketcap.com/static/img/coins/64x64/7278.png", "BRETT": "https://s2.coinmarketcap.com/static/img/coins/64x64/29743.png", "RUNE": "https://s2.coinmarketcap.com/static/img/coins/64x64/4157.png", "JASMY": "https://s2.coinmarketcap.com/static/img/coins/64x64/8425.png", "NOT": "https://s2.coinmarketcap.com/static/img/coins/64x64/28850.png", "ALGO": "https://s2.coinmarketcap.com/static/img/coins/64x64/4030.png", "JUP": "https://s2.coinmarketcap.com/static/img/coins/64x64/29210.png", "PYTH": "https://s2.coinmarketcap.com/static/img/coins/64x64/28177.png", "TIA": "https://s2.coinmarketcap.com/static/img/coins/64x64/22861.png", "EGLD": "https://s2.coinmarketcap.com/static/img/coins/64x64/6892.png", "FLR": "https://s2.coinmarketcap.com/static/img/coins/64x64/7950.png", "QNT": "https://s2.coinmarketcap.com/static/img/coins/64x64/3155.png", "SEI": "https://s2.coinmarketcap.com/static/img/coins/64x64/23149.png", "KCS": "https://s2.coinmarketcap.com/static/img/coins/64x64/2087.png", "CORE": "https://s2.coinmarketcap.com/static/img/coins/64x64/23254.png", "AKT": "https://s2.coinmarketcap.com/static/img/coins/64x64/7431.png", "FLOW": "https://s2.coinmarketcap.com/static/img/coins/64x64/4558.png", "DYDX": "https://s2.coinmarketcap.com/static/img/coins/64x64/28324.png", "STRK": "https://s2.coinmarketcap.com/static/img/coins/64x64/22691.png", "ENS": "https://s2.coinmarketcap.com/static/img/coins/64x64/13855.png", "AXS": "https://s2.coinmarketcap.com/static/img/coins/64x64/6783.png", "EOS": "https://s2.coinmarketcap.com/static/img/coins/64x64/1765.png", "BTT": "https://s2.coinmarketcap.com/static/img/coins/64x64/16086.png", "USDD": "https://s2.coinmarketcap.com/static/img/coins/64x64/19891.png", "XTZ": "https://s2.coinmarketcap.com/static/img/coins/64x64/2011.png", "BEAM": "https://s2.coinmarketcap.com/static/img/coins/64x64/28298.png", "OM": "https://s2.coinmarketcap.com/static/img/coins/64x64/6536.png", "BSV": "https://s2.coinmarketcap.com/static/img/coins/64x64/3602.png", "GALA": "https://s2.coinmarketcap.com/static/img/coins/64x64/7080.png", "NEO": "https://s2.coinmarketcap.com/static/img/coins/64x64/1376.png", "SAND": "https://s2.coinmarketcap.com/static/img/coins/64x64/6210.png", "ENA": "https://s2.coinmarketcap.com/static/img/coins/64x64/30171.png", "GT": "https://s2.coinmarketcap.com/static/img/coins/64x64/4269.png", "GNO": "https://s2.coinmarketcap.com/static/img/coins/64x64/1659.png", "ORDI": "https://s2.coinmarketcap.com/static/img/coins/64x64/25028.png", "SAFE": "https://s2.coinmarketcap.com/static/img/coins/64x64/21585.png", "ZK": "https://s2.coinmarketcap.com/static/img/coins/64x64/24091.png", "XEC": "https://s2.coinmarketcap.com/static/img/coins/64x64/10791.png", "NEXO": "https://s2.coinmarketcap.com/static/img/coins/64x64/2694.png", "PENDLE": "https://s2.coinmarketcap.com/static/img/coins/64x64/9481.png", "MANA": "https://s2.coinmarketcap.com/static/img/coins/64x64/1966.png", "CHZ": "https://s2.coinmarketcap.com/static/img/coins/64x64/4066.png"
      }

      try {
        const BTCresponse = await fetch(`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC&tsyms=USD&api_key=e41af537fc81ded20a82b3a025c2923b6a6db4dda1ea05ee53e8be2d162a3fad`, { method: 'GET' });
        const BTCres = await BTCresponse.json()
        const ETHresponse = await fetch(`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=ETH&tsyms=USD&api_key=e41af537fc81ded20a82b3a025c2923b6a6db4dda1ea05ee53e8be2d162a3fad`, { method: 'GET' });
        const ETHres = await ETHresponse.json()
        const ADAresponse = await fetch(`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=ADA&tsyms=USD&api_key=e41af537fc81ded20a82b3a025c2923b6a6db4dda1ea05ee53e8be2d162a3fad`, { method: 'GET' });
        const ADAres = await ADAresponse.json()
        const BNBresponse = await fetch(`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BNB&tsyms=USD&api_key=e41af537fc81ded20a82b3a025c2923b6a6db4dda1ea05ee53e8be2d162a3fad`, { method: 'GET' });
        const BNBres = await BNBresponse.json()
        const lasMarketPrice = await this.cacheManager.get('lastPrices')
        const news = await this.#getNews()
        const D = {
          theMostProfitable: [{
            name: 'Bitcoin',
            symbole: 'BTC',
            color: 'rgba( 6, 138, 138 , .9 )',
            growthPrecent: (lasMarketPrice ? ((BTCres?.RAW?.BTC?.USD?.PRICE - lasMarketPrice['BTC']) / lasMarketPrice['BTC']) * 100 : 0).toFixed(2),
            icon: symbols['BTC'],
            price: (BTCres?.RAW?.BTC?.USD?.PRICE).toFixed(2),
          },
          {
            name: 'Etherium',
            symbole: 'ETH',
            color: 'rgba(6, 138, 138,.9)',
            growthPrecent: (lasMarketPrice ? ((ETHres.RAW?.ETH?.USD?.PRICE - lasMarketPrice['ETH']) / lasMarketPrice['ETH']) * 100 : 0).toFixed(2),
            icon: symbols['ETH'],
            price: (ETHres.RAW?.ETH?.USD?.PRICE).toFixed(2),
          },
          {
            name: 'ADA',
            symbole: 'ADA',
            color: 'rgba(6, 138, 138,.9)',
            growthPrecent: (lasMarketPrice ? ((ADAres?.RAW?.ADA?.USD?.PRICE - lasMarketPrice['ADA']) / lasMarketPrice['ADA']) * 100 : 0).toFixed(2),
            icon: symbols['ADA'],
            price: (ADAres?.RAW?.ADA?.USD?.PRICE).toFixed(2),
          },
          {
            name: 'BNB',
            symbole: 'BNB',
            color: 'rgba(6, 138, 138,.9)',
            growthPrecent: (lasMarketPrice ? ((BNBres?.RAW?.BNB?.USD?.PRICE - lasMarketPrice['BNB']) / lasMarketPrice['BNB']) * 100 : 0).toFixed(2),
            icon: symbols['BNB'],
            price: (BNBres?.RAW?.BNB?.USD?.PRICE).toFixed(2),
          }],
          theMostlongTransActions: [{
            name: 'Bitcoin',
            symbole: 'BTC',
            color: 'rgba(6, 138, 138,.9)',
            growthPrecent: (lasMarketPrice ? ((BTCres.RAW.BTC?.USD.PRICE - lasMarketPrice['BTC']) / lasMarketPrice['BTC']) * 100 : 0).toFixed(2),
            icon: symbols['BTC'],
            price: (BTCres?.RAW?.BTC?.USD?.PRICE).toFixed(2),
          },
          {
            name: 'Etherium',
            symbole: 'ETH',
            color: 'rgba(6, 138, 138,.9)',
            growthPrecent: (lasMarketPrice ? ((ETHres.RAW?.ETH?.USD?.PRICE - lasMarketPrice['ETH']) / lasMarketPrice['ETH']) * 100 : 0).toFixed(2),
            icon: symbols['ETH'],
            price: (ETHres.RAW?.ETH?.USD?.PRICE).toFixed(2),
          },
          {
            name: 'ADA',
            symbole: 'ADA',
            color: 'rgba(6, 138, 138,.9)',
            growthPrecent: (lasMarketPrice ? ((ADAres?.RAW?.ADA?.USD?.PRICE - lasMarketPrice['ADA']) / lasMarketPrice['ADA']) * 100 : 0).toFixed(2),
            icon: symbols['ADA'],
            price: (ADAres?.RAW?.ADA?.USD?.PRICE).toFixed(2),
          },
          {
            name: 'BNB',
            symbole: 'BNB',
            color: 'rgba(6, 138, 138,.9)',
            growthPrecent: (lasMarketPrice ? ((BNBres?.RAW?.BNB?.USD?.PRICE - lasMarketPrice['BNB']) / lasMarketPrice['BNB']) * 100 : 0).toFixed(2),
            icon: symbols['BNB'],
            price: (BNBres?.RAW?.BNB?.USD?.PRICE).toFixed(2),
          }],
          mostShortTransActions: [{
            name: 'Bitcoin',
            symbole: 'BTC',
            color: 'rgba(6, 138, 138,.9)',
            growthPrecent: (lasMarketPrice ? ((BTCres.RAW.BTC?.USD.PRICE - lasMarketPrice['BTC']) / lasMarketPrice['BTC']) * 100 : 0).toFixed(2),
            icon: symbols['BTC'],
            price: (BTCres?.RAW?.BTC?.USD?.PRICE).toFixed(2),
          },
          {
            name: 'Etherium',
            symbole: 'ETH',
            color: 'rgba(6, 138, 138,.9)',
            growthPrecent: (lasMarketPrice ? ((ETHres.RAW?.ETH?.USD?.PRICE - lasMarketPrice['ETH']) / lasMarketPrice['ETH']) * 100 : 0).toFixed(2),
            icon: symbols['ETH'],
            price: (ETHres.RAW?.ETH?.USD?.PRICE).toFixed(2),
          },
          {
            name: 'ADA',
            symbole: 'ADA',
            color: 'rgba(6, 138, 138,.9)',
            growthPrecent: (lasMarketPrice ? ((ADAres?.RAW?.ADA?.USD?.PRICE - lasMarketPrice['ADA']) / lasMarketPrice['ADA']) * 100 : 0).toFixed(2),
            icon: symbols['ADA'],
            price: (ADAres?.RAW?.ADA?.USD?.PRICE).toFixed(2),
          },
          {
            name: 'BNB',
            symbole: 'BNB',
            color: 'rgba(6, 138, 138,.9)',
            growthPrecent: (lasMarketPrice ? ((BNBres?.RAW?.BNB?.USD?.PRICE - lasMarketPrice['BNB']) / lasMarketPrice['BNB']) * 100 : 0).toFixed(2),
            icon: symbols['BNB'],
            price: (BNBres?.RAW?.BNB?.USD?.PRICE).toFixed(2),
          }],
          news: news
        }
        await this.cacheManager.set('prices', D)
        await this.cacheManager.set('lastPrices', { BTC: BTCres.RAW.BTC.USD.PRICE, ETH: ETHres.RAW.ETH.USD.PRICE, ADA: ADAres.RAW.ADA.USD.PRICE, BNB: BNBres.RAW.BNB.USD.PRICE })
        return D
      } catch (error) {
        console.log(error)

      }
    }
  }

  /**
   * this is for validating user token for connecting to server
   * @param token 
   * @returns 
   */
  async #checkToken(token: string | undefined | null) {
    try {
      if (typeof (token) == undefined) {
        return false;
      }

      if (!token) {
        return false;
      }

      const decodedToken = jwt.verify(token, '2a0a2e12d2cf56b83c77dbce2a1bf4af4f5f45b8742745ea524bf404d284fc36')
      if (!decodedToken) {
        return false;
      }

      return decodedToken;

    } catch (error) {
      console.log('error occured . . .')
      return false;
    }
  }





  /**
   * this is for when user just come to signal page and we send for them all their signals
   * @param client 
   * @param payload 
   * @returns all connected user's signals as vip and free and history
   */
  async getAllSignals(client: Socket, payload: any) {
    const user = this.connectedClients.get(client.id)
    if (user.data.role == 0) {
      return this.server.to(client.id).emit('allSignals', { error: 'for seeing signals , you should upgrade your profile first' })
    }
    let historysignals = await this.signalModel.find({
      $and: [
        { signalType: 'vip' }, { status: { $gt: 0 } },
        { 'leader.id': { $in: user.data.leader } }
      ]
    }).sort({ 'createdAt': -1 })

    let vipSignals = await this.signalModel.find({
      $and: [
        { signalType: 'vip' }, { status: 0 },
        { 'leader.id': { $in: user.data.leader } }
      ]
    }).sort({ 'createdAt': -1 })

    let freeSignals = await this.signalModel.find({ $and: [{ signalType: 'free' }, { status: 0 }] }).sort({ 'createdAt': -1 })
    return this.server.to(client.id).emit('allSignals', { freeSignals: freeSignals, vipsignals: vipSignals, history: historysignals })
  }





  /**
   * this is for refreshing signals afrer refreshing by leader
   * @param leaderId as string that we refresh all subusers of that leader
   */
  async refreshSignals(leaderId: string) {
    let leader = new mongoose.Types.ObjectId(leaderId)
    const connectedUser = this.connectedClients.keys()
    const users = connectedUser[Symbol.iterator]()
    const leadersUsers = []
    for (const item of users) {
      const user: any = this.connectedClients.get(item)
      if (user.leader.includes(leader)) {
        leadersUsers[item] = user
      }
    }
    let historysignals = await this.signalModel.find({
      $and: [
        { signalType: 'vip' }, { status: { $gt: 0 } },
        { 'leader.id': { $in: leader } }
      ]
    }).sort({ 'createdAt': -1 })

    let vipSignals = await this.signalModel.find({
      $and: [
        { signalType: 'vip' }, { status: 0 },
        { 'leader.id': { $in: leader } }
      ]
    }).sort({ 'createdAt': -1 })

    let freeSignals = await this.signalModel.find({ $and: [{ signalType: 'free' }, { status: 0 }] }).sort({ 'createdAt': -1 })
    this.server.to(leadersUsers).emit('allSignals', { freeSignals: freeSignals.reverse(), vipsignals: vipSignals.reverse(), history: historysignals.reverse() })
  }


  /**
   * this function make the all data ready for the home page for first time
   * @param client 
   * @param payload 
   * @returns 
   */
  async homePageConnection(client : Socket , payload :any){
    const data = await this.#firsData()
      console.log('data>>>>>>>>>' , data)
      // await this.cacheManager.set('prices' , data)
      return this.server.to(client.id).emit('homeData', data)
  }



  async emitNewData(){
    const data = await this.#firsData()
    return this.server.emit('homeData', data)
  }



  /**
   * when user clicking on the crypto card and open it this connection occured and the price will emit 
   * @param client 
   * @param payload 
   * @returns 
   */
  async priceConnection(client: Socket, payload: any) {
    console.log('crypto', payload?.symbol)
    const response = await fetch(`https://min-api.cryptocompare.com/data/v2/histohour?toTs=${new Date().getTime()}&fsym=${payload.symbol}&tsym=USD&limit=7&api_key=e41af537fc81ded20a82b3a025c2923b6a6db4dda1ea05ee53e8be2d162a3fad`, { method: 'GET' });
    const res = await response.json()
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

    const data = res?.Data?.Data.reverse()
    //! finding the range of price
    let minimum = data[0].low
    data.forEach((elem: any) => {
      if (elem?.low < minimum) {
        minimum = elem.low
      }
    })
    //! the minimum found for the chart in the front
    console.log('chart>>>', data)
    console.log('minimum>>>', minimum)
    const lastData = []
    let currentTime = Date.now()
    console.log('hours>>>>>>>', currentTime)
    for (let i = 0; i < data.length; i++) {
      const miliseconds = i * 3600000
      const hour = currentTime - miliseconds
      const D = {
        time: hour,
        // time: weekday[day],
        price: data[i]?.close,
      }
      lastData.push(D)
    }
    console.log('chart2>>>', lastData)
    return this.server.to(client.id).emit(`${payload.symbol}`, { data: lastData.reverse(), minimum: minimum })
  }



}
