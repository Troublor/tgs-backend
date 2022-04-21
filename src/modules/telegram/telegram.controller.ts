import { Controller, Get, Param, Post, Res, UseFilters } from '@nestjs/common';
import { Response } from 'express';
import RESTfulExceptionFilter from '../RESTful.middleware.js';
import {
  ApiBadRequestResponse,
  ApiConsumes,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('/telegram')
@ApiTags('telegram')
@UseFilters(RESTfulExceptionFilter)
export class TelegramController {
  @Get('/notify/:userId/:message')
  @ApiBadRequestResponse({ description: 'Empty message to send' })
  @ApiNotFoundResponse({ description: 'No chat associated with userId' })
  notify(
    @Param('message') msg: string,
    @Param('userId') userId: string,
    @Res() resp: Response,
  ) {
    resp.redirect(`/message/telegram/${userId}/${msg}`);
  }

  @Post('/notify/:userId')
  @ApiConsumes('text/plain')
  @ApiBadRequestResponse({ description: 'Empty message to send' })
  @ApiNotFoundResponse({ description: 'No chat associated with userId' })
  async postNotify(@Param('userId') userId: string, @Res() resp: Response) {
    resp.redirect(`/message/telegram/${userId}`);
  }
}
