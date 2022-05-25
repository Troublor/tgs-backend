import { Module } from '@nestjs/common';
import ToolsModule from './modules/tools/tools.module.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configLoader, { appRoot } from './config/loader.js';
import { AppController } from './app.controller.js';
import { WinstonModule } from 'nest-winston';
import winston from 'winston';
import { structured } from '@troubkit/log';
import * as path from 'path';
import { TelegramModule } from './modules/telegram/telegram.module.js';
import DatabaseModule from './modules/database/database.module.js';
import AuthModule from './modules/auth/auth.module.js';
import MessageModule from './modules/message/message.module.js';
import UrlModule from './modules/url/url.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configLoader],
      isGlobal: true,
    }),
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const logFile = configService.get('log.file');
        const transports: any[] = [
          new winston.transports.Console({
            format: structured({ colorize: true }),
          }),
        ];
        if (logFile) {
          transports.push(
            new winston.transports.File({
              filename: path.join(appRoot, logFile),
            }),
          );
        }
        return {
          level: configService.get('log.level'),
          transports: transports,
        };
      },
    }),
    DatabaseModule,
    AuthModule,
    MessageModule,
    UrlModule,
    ToolsModule,
    TelegramModule,
  ],
  controllers: [AppController],
})
export default class AppModule {}
