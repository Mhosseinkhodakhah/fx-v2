import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RoleGaurdGuard } from './role-gaurd/role-gaurd.guard';
import { ResponseInterceptor } from './response/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new ResponseInterceptor())
  await app.listen(process.env.PORT ?? 9015);
}
bootstrap();
