import { Module } from '@nestjs/common';
import path from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigService } from '@nestjs/config';
import { appRoot } from '../../config/loader';

@Module({
  imports: [
    // Homepage is build via React, and compiled into static files. So here we only need to serve static files
    ServeStaticModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          rootPath: path.join(
            appRoot,
            configService.get('frontend.profile') as string,
          ),
          renderPath: '/profile/*',
          serveRoot: '/profile',
        },
      ],
    }),
  ],
  controllers: [],
  providers: [],
})
export default class HomeModule {}
