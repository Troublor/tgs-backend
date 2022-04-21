import { NestFactory } from '@nestjs/core';
import AppModule from './app.module.js';
import HttpExceptionFilter from './http-exception.filter.js';
import JsExceptionFilter from './js-exception.filter.js';
import express from 'express';
import { ConfigService } from '@nestjs/config';
import { ExpressAdapter } from '@nestjs/platform-express';
import https from 'https';
import fs from 'fs';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

async function bootstrap() {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  // configure
  const configService: ConfigService = app.get(ConfigService);
  // openAPI doc
  await openAPI(app);

  app.useGlobalFilters(
    new JsExceptionFilter(),
    new HttpExceptionFilter(configService),
  );

  // listen
  const port = configService.get<number>('port');
  const httpsPort = configService.get<number>('httpsPort');
  if (httpsPort) {
    const httpsOptions = {
      key: fs.readFileSync(configService.get<string>('ssl.key') as string),
      cert: fs.readFileSync(configService.get<string>('ssl.cert') as string),
      ca: fs.readFileSync(configService.get<string>('ssl.ca') as string),
    };
    https.createServer(httpsOptions, server).listen(httpsPort);
  }
  await app.listen(port as number);
  console.log(`Server running on http://localhost:${port}`);
}

async function openAPI(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Troublor General Server')
    .setDescription('API documentation')
    .setVersion('1.0')
    .addTag('tools')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/', app, document);
}

bootstrap()
  .then(() => {
    console.log('Server started');
  })
  .catch((e) => {
    console.error(e);
  });
