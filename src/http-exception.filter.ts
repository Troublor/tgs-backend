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

    if (status == 404) {
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
    } else {
      response.status(status).send({
        statusCode: status,
        timestamp: new Date().toISOString(),
        message: exception.message,
      });
    }
  }
}
