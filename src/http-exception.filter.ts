import {
  Catch,
  HttpException,
  ExceptionFilter,
  ArgumentsHost,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';
import { appRoot } from './config/loader';

@Catch(HttpException)
export default class HttpExceptionFilter
  implements ExceptionFilter<HttpException>
{
  constructor(private configService: ConfigService) {}

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    switch (status) {
      case 500:
        response.status(status).send(
          fs.readFileSync(
            path.join(
              appRoot,
              this.configService.get<string>('frontend.5xx') as string,
              'index.html',
            ),
            {
              encoding: 'utf-8',
            },
          ),
        );
        break;
      case 404:
        response.status(status).send(
          fs.readFileSync(
            path.join(
              appRoot,
              this.configService.get<string>('frontend.4xx') as string,
              'index.html',
            ),
            {
              encoding: 'utf-8',
            },
          ),
        );
        break;
      default:
        response.status(status).json({
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
          reason: exception.message,
        });
    }
  }
}
