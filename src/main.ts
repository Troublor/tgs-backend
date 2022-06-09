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
import { WinstonModule } from 'nest-winston';
import { buildWinstonConfig } from './logger';
import Config from './config/schema';

async function bootstrap() {
  const logger = await WinstonModule.createLogger(buildWinstonConfig());
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
    logger: logger,
  });

  // configure
  const configService: ConfigService<Config, true> = app.get(ConfigService);
  // openAPI doc
  await openAPI(app);

  app.useGlobalFilters(
    new JsExceptionFilter(),
    new HttpExceptionFilter(configService),
  );

  // listen
  const port = configService.get('port', { infer: true });
  const httpsConfig = configService.get('https', { infer: true });
  if (httpsConfig) {
    const httpsOptions = {
      key: fs.readFileSync(httpsConfig.key),
      cert: fs.readFileSync(httpsConfig.cert),
      ca: httpsConfig.ca ? fs.readFileSync(httpsConfig.ca) : undefined,
    };
    https.createServer(httpsOptions, server).listen(httpsConfig.port);
  }
  await app.listen(port);
  logger.log(`Server listening on port://0.0.0.0:${port}`);
}

async function openAPI(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Troublor General Server')
    .setDescription('API documentation')
    .setVersion('1.0')
    .addTag('tools')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document);
}

bootstrap().catch((e) => {
  console.error(e);
});
