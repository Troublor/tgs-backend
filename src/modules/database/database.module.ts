import { Inject, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { AppData } from './data-source.js';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import UserService from './user.service.js';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import JwtService from './jwt.service.js';
import UrlService from './url.service.js';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('auth.secret', 'secret'),
      }),
    }),
  ],
  providers: [UserService, JwtService, UrlService],
  exports: [UserService, JwtService, UrlService],
})
export default class DatabaseModule implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async onModuleInit() {
    try {
      await AppData.initialize();
    } catch (error) {
      this.logger.error('Error in data source initialization', { err: error });
    }
  }

  async onModuleDestroy() {
    try {
      await AppData.destroy();
    } catch (e) {
      this.logger.error('Error when destroying data source', { err: e });
    }
  }
}
