import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as morgan from 'morgan';
import * as cookieParser from 'cookie-parser';
import { RequestMethod } from '@nestjs/common';

const optionsCors = {
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  origin:
    process.env.NODE_ENV === 'production'
      ? 'https://khumuivietnam.com'
      : 'http://localhost:3000',
};
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(optionsCors);
  app.use(morgan('tiny'));
  app.use(cookieParser());
  app.setGlobalPrefix('api/v1', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });
  await app.listen(5000);
}
bootstrap();
