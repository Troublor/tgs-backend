import { Controller, Get } from '@nestjs/common';

@Controller('/')
export class AppController {
  @Get('/ping')
  getPing(): string {
    return 'Yes, you got it right!';
  }
}
