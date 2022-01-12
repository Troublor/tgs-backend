import {
  Catch,
  HttpException,
  ExceptionFilter,
  ArgumentsHost,
} from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import fs from 'fs';
import path from 'path';
import { appRoot } from './config/loader';

@Catch(HttpException)
export default class HttpExceptionFilter
  implements ExceptionFilter<HttpException>
{
  constructor(private configService: ConfigService) {}

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    switch (Math.floor(status / 100)) {
      case 4:
        response.status(200).send(
          fs.readFileSync(
            path.join(
              appRoot,
              this.configService.get<string>('frontend') as string,
              'index.html',
            ),
            {
              encoding: 'utf-8',
            },
          ),
        );
        break;
      case 5:
        response.status(status).send(
          fs.readFileSync(
            path.join(
              appRoot,
              this.configService.get<string>('frontend') as string,
              'index.html',
            ),
            {
              encoding: 'utf-8',
            },
          ),
        );
        break;
    }
  }
}
