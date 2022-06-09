import fs from 'fs-extra';
import * as yaml from 'js-yaml';
import * as path from 'path';
import { join } from 'path';
import Config from './schema.js';
import { fileURLToPath } from 'url';
import { validateSync } from 'class-validator';
import { plainToClass } from 'class-transformer';

const YAML_CONFIG_FILENAME = 'config.yaml';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const configFile = process.env.CONFIG || YAML_CONFIG_FILENAME;

export const appRoot = join(__dirname, '..', '..');

let config: Config | undefined;
const loadConfig = (): Config => {
  if (config) return config as Config;

  config = new Config();
  if (fs.pathExistsSync(configFile)) {
    const obj = yaml.load(fs.readFileSync(configFile, 'utf8')) as Record<
      string,
      unknown
    >;
    const cfg = plainToClass(Config, obj, { enableImplicitConversion: true });
    config = Object.assign(config, cfg);
  }
  const errors = validateSync(config);
  if (errors.length > 0) {
    throw new Error(JSON.stringify(errors, null, 2));
  }
  return config;
};

export default loadConfig;
