import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Inject,
} from '@nestjs/common';
import { Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Catch(HttpException, Error)
export default class RESTfulExceptionFilter
  implements ExceptionFilter<HttpException | Error>
{
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  catch(exception: HttpException | Error, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      response.status(status).send({
        statusCode: status,
        timestamp: new Date().toISOString(),
        message: exception.message,
      });
    } else {
      this.logger.error('Error occurs in the application', {
        err: exception.message,
      });
      response.status(500).send({
        statusCode: 500,
        timestamp: new Date().toISOString(),
        message: 'Internal server error',
      });
    }
  }
}
