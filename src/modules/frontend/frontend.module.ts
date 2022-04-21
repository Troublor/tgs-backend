import { Module } from '@nestjs/common';
import path from 'path';
import { appRoot } from '../../config/loader.js';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ServeStaticModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          rootPath: path.join(appRoot, configService.get('frontend') as string),
          renderPath: '/static/*',
          serveRoot: '/',
          serveStaticOptions: {},
        },
      ],
    }),
    ServeStaticModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          rootPath: path.join(appRoot, configService.get('frontend') as string),
          renderPath: '/',
          serveRoot: '/',
        },
      ],
    }),
  ],
})
export class FrontendModule {}
