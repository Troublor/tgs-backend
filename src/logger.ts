import { WinstonModuleOptions } from 'nest-winston';
import winston from 'winston';
import { structured } from '@troubkit/log';
import path from 'path';
import loader, { appRoot } from './config/loader.js';

export function buildWinstonConfig(): WinstonModuleOptions {
  const config = loader();
  const logFile = config.log.file;
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
    level: config.log.level,
    transports: transports,
  };
}
