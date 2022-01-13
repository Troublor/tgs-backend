import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
  UseFilters,
} from '@nestjs/common';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import NotifierBotService from './notifier-bot.service';
import { UserId } from './user-chat-map.service';
import rawBody from 'raw-body';
import { Request } from 'express';
import RESTfulExceptionFilter from '../RESTful.middleware';
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
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly botService: NotifierBotService,
  ) {}

  @Get('/notify/:userId/:message')
  @ApiBadRequestResponse({ description: 'Empty message to send' })
  @ApiNotFoundResponse({ description: 'No chat associated with userId' })
  notify(
    @Param('message') msg: string,
    @Param('userId') userId: UserId,
  ): string {
    if (!msg) {
      throw new BadRequestException(new Error('empty message'));
    }
    this.botService.sendMessage(userId, msg);
    return `Message sent to user ${userId}: msg=${msg}`;
  }

  @Post('/notify/:userId')
  @ApiConsumes('text/plain')
  @ApiBadRequestResponse({ description: 'Empty message to send' })
  @ApiNotFoundResponse({ description: 'No chat associated with userId' })
  async postNotify(
    @Param('userId') userId: UserId,
    @Body() body: string,
    @Req() req: Request,
  ) {
    if (!req.body) {
      throw new BadRequestException(new Error('empty message'));
    }
    const raw = await rawBody(req);
    const text = raw.toString().trim();
    if (text.length == 0) {
      throw new BadRequestException(new Error('empty message'));
    }
    this.botService.sendMessage(userId, text);
    return `Message sent to user ${userId}: \n${text}`;
  }
}
