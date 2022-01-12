import { Controller, Get, Redirect } from '@nestjs/common';

@Controller()
export default class AppController {
  @Get('/')
  @Redirect('/profile')
  getHome() {
    return;
  }
}
