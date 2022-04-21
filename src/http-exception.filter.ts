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
import { appRoot } from './config/loader.js';

@Catch(HttpException)
export default class HttpExceptionFilter
  implements ExceptionFilter<HttpException>
{
  constructor(private readonly configService: ConfigService) {}

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    if (status == 404) {
      try {
        const frontend = fs.readFileSync(
          path.join(
            appRoot,
            this.configService.get<string>('frontend') as string,
            'index.html',
          ),
          {
            encoding: 'utf-8',
          },
        );
        response.status(200).send(frontend);
      } catch (e) {
        console.error('Failed to serve frontend', { err: e });
        response.status(404).send({
          statusCode: status,
          timestamp: new Date().toISOString(),
          message: exception.message,
        });
      }
    } else {
      response.status(status).send({
        statusCode: status,
        timestamp: new Date().toISOString(),
        message: exception.message,
      });
    }
  }
}
