import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { CurrenciesService } from './currencies/currencies.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService , private readonly currenciApi : CurrenciesService) {}


  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCronApi(){
    console.log('start cronjob')
    await this.currenciApi.getAllCurrencies()
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
