import { Module } from '@nestjs/common';
import { SocektService } from './socekt.service';
import { SocektGateway } from './socekt.gateway';

@Module({
  providers: [SocektGateway, SocektService],
})
export class SocektModule {}
