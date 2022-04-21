import {
  BadRequestException,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { ApiConsumes } from '@nestjs/swagger';
import { PlainBody } from '../plain-body.decorator.js';
import { URL } from 'url';
import UrlService from '../database/url.service.js';
import { Response } from 'express';

@Controller('/url')
export default class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post('/map/:key?')
  @ApiConsumes('text/plain')
  async mapKeyToUrl(
    @PlainBody() body: string,
    @Param('key') key?: string,
  ): Promise<Record<string, unknown>> {
    if (!key) key = '';
    try {
      new URL(body);
    } catch (e) {
      throw new BadRequestException(`invalid url: ${e}`);
    }
    const url = await this.urlService.getUrlByKey(key);
    if (url) throw new ConflictException('key already exists');
    const entry = await this.urlService.createUrlMapEntry(key, body);
    return entry.jsonObject;
  }

  @Get('/:key')
  async redirectToUrlByKey(@Param('key') key: string, @Res() resp: Response) {
    const url = await this.urlService.getUrlByKey(key);
    if (!url) throw new NotFoundException(`no url mapped to key '${key}'`);
    resp.redirect(url.url);
  }

  @Delete('/:key')
  async deleteKey(@Param('key') key: string) {
    const deleted = await this.urlService.deleteKey(key);
    if (!deleted) {
      throw new NotFoundException('key not found');
    }
  }
}
