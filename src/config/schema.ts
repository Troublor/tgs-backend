import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsOptional,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export const logLevels = ['debug', 'info', 'warn', 'error'] as const;

export class LogConfig {
  @IsIn(logLevels)
  level: typeof logLevels[number] = 'info';

  @IsOptional()
  file: string | null = null;
}

export class NotifierBotConfig {
  @IsNotEmpty()
  token!: string;
}

export class DatabaseConfig {
  @IsNotEmpty()
  type = 'postgres';

  @IsNotEmpty()
  host = 'localhost';

  @Min(1)
  @Max(65535)
  port = 5432;

  @IsNotEmpty()
  username = 'tgs';

  password = '';

  @IsNotEmpty()
  database = 'tgs';

  @IsNotEmpty()
  @IsBoolean()
  migrationsRun = false;
}

export class HttpsConfig {
  @IsNotEmpty()
  @Min(1)
  @Max(65535)
  port = 443;

  @IsNotEmpty()
  key!: string;

  @IsNotEmpty()
  cert!: string;

  @IsOptional()
  ca: string | null = null;
}

export default class Config {
  @IsNotEmpty()
  @Min(1)
  @Max(65535)
  port = 80;

  @IsNotEmpty()
  @ValidateNested()
  log: LogConfig = new LogConfig();

  @IsOptional()
  @ValidateNested()
  'telegram-bot': NotifierBotConfig | null = null; // if this is undefined, telegram bot will not be started

  @IsNotEmpty()
  @ValidateNested()
  database: DatabaseConfig = new DatabaseConfig();

  @IsOptional()
  @ValidateNested()
  https: HttpsConfig | null = null; // if this is undefined, https will not be available
}
