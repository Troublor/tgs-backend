import { Module } from '@nestjs/common';
import ToolsModule from './modules/tools/tools.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configLoader, { appRoot } from './config/loader';
import { FrontendModule } from './modules/frontend/frontend.module';
import { AppController } from './app.controller';
import { WinstonModule } from 'nest-winston';
import winston from 'winston';
import { structured } from '@troubkit/log';
import * as path from 'path';
import { TelegramModule } from './modules/telegram/telegram.module';

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
    FrontendModule,
    ToolsModule,
    TelegramModule,
  ],
  controllers: [AppController],
})
export default class AppModule {}
