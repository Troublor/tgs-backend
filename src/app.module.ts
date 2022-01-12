import { Module } from '@nestjs/common';
import AppController from './app.controller';
import ToolsModule from './modules/tools/tools.module';
import HomeModule from './modules/home/home.module';
import { ConfigModule } from '@nestjs/config';
import configLoader from './config/loader';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configLoader],
      isGlobal: true,
    }),
    HomeModule,
    ToolsModule,
  ],
  controllers: [AppController],
})
export default class AppModule {}
