import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RoleGaurdGuard } from './role-gaurd/role-gaurd.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 4009);
}
bootstrap();
