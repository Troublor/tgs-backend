import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  UseFilters,
} from '@nestjs/common';
import ToolsService from './tools.service.js';
import axios from 'axios';
import _ from 'lodash';
import { ApiConsumes, ApiParam, ApiTags } from '@nestjs/swagger';
import RESTfulExceptionFilter from '../RESTful.middleware.js';
import { Request } from 'express';
import rawBody from 'raw-body';

@Controller('tools')
@ApiTags('tools')
@UseFilters(RESTfulExceptionFilter)
export default class ToolsController {
  constructor(private readonly toolsService: ToolsService) {}

  @Get('bus/eta/:preset')
  @ApiParam({
    name: 'preset',
    description: 'Bus preset',
    enum: ['hkust2home', 'home2hkust'],
  })
  async busETA(@Param('preset') p: string): Promise<string> {
    const presets: Record<
      string,
      { busStopId: string; route: string; direction: 'I' | 'O' }
    > = {
      hkust2home: {
        busStopId: 'B3E60EE895DBBF06', // HKUST North
        route: '91M',
        direction: 'I',
      },
      home2hkust: {
        busStopId: '796CAA794D4DEBE8', //宝林总站
        route: '91M',
        direction: 'O',
      },
    };
    if (!(p in presets)) {
      throw new NotFoundException();
    }
    const preset = presets[p];

    const r = await axios.get(
      `https://data.etabus.gov.hk/v1/transport/kmb/stop-eta/${preset.busStopId}`,
    );
    const results = r.data.data;
    type Result = {
      route: string;
      dir: 'I' | 'O';
      eta: string;
    };
    const etas: Date[] = results
      .filter(
        (result: Result) =>
          result.route === preset.route && result.dir === preset.direction,
      )
      .filter((result: Result) => result.eta)
      .map((result: Result) => new Date(result.eta))
      .sort();
    const now = Date.now();

    if (etas.length === 0) {
      return 'No bus available.';
    }

    const special = [
      'zeroth',
      'first',
      'second',
      'third',
      'fourth',
      'fifth',
      'sixth',
      'seventh',
      'eighth',
      'ninth',
      'tenth',
      'eleventh',
      'twelfth',
      'thirteenth',
      'fourteenth',
      'fifteenth',
      'sixteenth',
      'seventeenth',
      'eighteenth',
      'nineteenth',
    ];
    const deca = [
      'twent',
      'thirt',
      'fort',
      'fift',
      'sixt',
      'sevent',
      'eight',
      'ninet',
    ];

    function stringifyNumber(n: number) {
      if (n < 20) return special[n];
      if (n % 10 === 0) return deca[Math.floor(n / 10) - 2] + 'ieth';
      return deca[Math.floor(n / 10) - 2] + 'y-' + special[n % 10];
    }

    function capitalizeFirstLetter(str: string) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }

    return (
      preset.route +
      ':\n' +
      _.unionBy(etas, (t) => t.toString())
        .map((t) => t.getTime() - now)
        .map((d) => d / 1000 / 60)
        .map(
          (d, i) =>
            `${capitalizeFirstLetter(
              stringifyNumber(i + 1),
            )} bus: in ${d.toFixed(2)} min`,
        )
        .join('\n')
    );
  }

  @Get('md5/:payload')
  getMd5(@Param('payload') payload: string): string {
    return this.toolsService.md5(payload);
  }

  @Post('md5')
  @ApiConsumes('text/plain')
  async postMd5(@Body() payload: string, @Req() req: Request): Promise<string> {
    if (!req.body) {
      throw new BadRequestException(new Error('empty payload'));
    }
    const raw = await rawBody(req);
    const text = raw.toString().trim();
    if (text.length == 0) {
      throw new BadRequestException(new Error('empty payload'));
    }
    return this.toolsService.md5(text);
  }
}
