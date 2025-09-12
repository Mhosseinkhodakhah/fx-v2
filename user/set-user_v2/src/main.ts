import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RoleGaurdGuard } from './role-gaurd/role-gaurd.guard';
import { ResponseInterceptor } from './response/response.interceptor';
import * as ApiBasicAuth from "express-basic-auth";
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    ['/swagger', '/swagger-json'],
    ApiBasicAuth({
      challenge: true,
      // this is the username and password used to authenticate
      users: { admin: process.env.SWAGGERPASSWORD },
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('Your API')
    .setDescription('API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  app.useGlobalInterceptors(new ResponseInterceptor());
  SwaggerModule.setup('swagger', app, document);
  
  app.useGlobalInterceptors(new ResponseInterceptor())
  await app.listen(process.env.PORT ?? 9015);
}
bootstrap();
