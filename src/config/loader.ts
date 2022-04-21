import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';
import { configSchema } from './schema.js';
import { fileURLToPath } from 'url';
import * as path from 'path';

const YAML_CONFIG_FILENAME = 'config.yaml';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const appRoot = join(__dirname, '..', '..');

const configLoader = () => {
  const payload = yaml.load(
    readFileSync(YAML_CONFIG_FILENAME, 'utf8'),
  ) as Record<string, any>;
  const validated = configSchema.validate(payload);
  if (validated.error) {
    throw new Error(`Config validation error: ${validated.error.message}`);
  }
  return payload;
};

export default configLoader;
