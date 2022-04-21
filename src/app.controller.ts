import { Controller, Get } from '@nestjs/common';
import fs from 'fs';
import * as path from 'path';
import { appRoot } from './config/loader.js';

@Controller('/')
export class AppController {
  @Get('/ping')
  getPing(): string {
    return 'Yes, you got it right!';
  }

  @Get('/version')
  getVersion(): string {
    const packageJson = JSON.parse(
      fs.readFileSync(path.join(appRoot, 'package.json'), 'utf8'),
    );
    return 'v' + packageJson.version;
  }
}
