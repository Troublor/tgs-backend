import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import User from './entities/user.entity.js';
import Jwt from './entities/jwt.entity.js';
import TelegramChat from './entities/telegram-chat.entity.js';
import Email from './entities/email.entity.js';
import Message from './entities/message.entity.js';
import Url from './entities/url.entity.js';

const commonOpts: Partial<DataSourceOptions> = {
  logging: false,
  synchronize: false,
  entities: [User, Jwt, TelegramChat, Email, Message, Url],
  subscribers: [],
};

const options: DataSourceOptions = {
  type: 'postgres',
  host: '127.0.0.1',
  port: 5432,
  username: 'troublor',
  password: '',
  database: 'tgs',
};

const DefaultDataSource = new DataSource({
  ...commonOpts,
  ...options,
} as DataSourceOptions);

export const TestDataSource = new DataSource({
  ...commonOpts,
  ...options,
  database: 'tgs-test',
  synchronize: true,
  migrations: ['./src/**/migrations/*.ts'],
} as DataSourceOptions);

export let AppData = DefaultDataSource;

// useful in test
export function setAppDataSource(dataSource: DataSource) {
  AppData = dataSource;
}
