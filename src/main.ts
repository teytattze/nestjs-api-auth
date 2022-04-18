import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import bodyParser from 'body-parser';
import config from 'config';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import httpContext from 'express-http-context';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import 'dotenv/config';

const GLOBAL_PREFIX = 'api';
const SERVICE_NAME = config.get<string>('service.name').toUpperCase();
const HOST = config.get<string>('server.host');
const PORT = config.get<number>('server.port');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    credentials: true,
    origin: ['http://localhost:3000'],
  });
  app.setGlobalPrefix(GLOBAL_PREFIX);

  app.use(bodyParser.json());
  app.use(httpContext.middleware);
  app.use(cookieParser());
  app.use(helmet());

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  await app.listen(PORT);
  Logger.log(
    `API ${SERVICE_NAME} is listening on http://${HOST}:${PORT}/api...`,
  );
}
bootstrap();
