import { Module } from '@nestjs/common';
import ToolsModule from './modules/tools/tools.module';
import { ConfigModule } from '@nestjs/config';
import configLoader from './config/loader';
import { FrontendModule } from './modules/frontend/frontend.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configLoader],
      isGlobal: true,
    }),
    FrontendModule,
    ToolsModule,
  ],
  controllers: [AppController],
})
export default class AppModule {}
