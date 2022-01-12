import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export default class JsExceptionFilter implements ExceptionFilter<Error> {
  catch(exception: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    response.status(500).send('500');
    console.error(exception.stack);
  }
}
