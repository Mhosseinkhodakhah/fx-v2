import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { CurrenciesService } from './currencies/currencies.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService , private readonly currenciApi : CurrenciesService) {

    setInterval(()=>{
      console.log('start cronjob')
      this.handleCronApi()
    } , 50000)

  }


  async handleCronApi(){
    this.currenciApi.getAllCurrencies()
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
