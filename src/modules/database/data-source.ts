import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import User from './entities/user.entity.js';
import Jwt from './entities/jwt.entity.js';
import TelegramChat from './entities/telegram-chat.entity.js';
import Email from './entities/email.entity.js';
import Message from './entities/message.entity.js';

const commonOpts: Partial<DataSourceOptions> = {
  logging: true,
  synchronize: false,
  entities: [User, Jwt, TelegramChat, Email, Message],
  migrations: ['src/modules/database/migrations/*.{ts.js}'],
  subscribers: [],
};

const options: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
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
  type: 'sqljs',
  synchronize: true,
} as DataSourceOptions);

export let AppData = DefaultDataSource;

// useful in test
export function setAppDataSource(dataSource: DataSource) {
  AppData = dataSource;
}
