import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import User from './entities/user.entity.js';
import Jwt from './entities/jwt.entity.js';
import TelegramChat from './entities/telegram-chat.entity.js';
import Email from './entities/email.entity.js';
import Message from './entities/message.entity.js';
import Url from './entities/url.entity.js';
import MessageDestination from './entities/message-destination.entity.js';
import loader from '../../config/loader.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const commonOpts: Partial<DataSourceOptions> = {
  logging: false,
  synchronize: false,
  entities: [User, Jwt, TelegramChat, Email, Message, Url, MessageDestination],
  subscribers: [],
};

const cfg = loader();
const options: DataSourceOptions = cfg.database as DataSourceOptions;

const DefaultDataSource = new DataSource({
  ...commonOpts,
  ...options,
  logging: cfg.log.level == 'debug',
  migrations: [path.join(__dirname, 'migrations/*{.ts,.js}')],
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
