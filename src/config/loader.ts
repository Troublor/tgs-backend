import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';
import { configSchema } from './schema';

const YAML_CONFIG_FILENAME = 'config.yaml';

export const appRoot = join(__dirname, '..', '..');

const configLoader = () => {
  const payload = yaml.load(
    readFileSync(join(appRoot, YAML_CONFIG_FILENAME), 'utf8'),
  ) as Record<string, any>;
  const validated = configSchema.validate(payload);
  if (validated.error) {
    throw new Error(`Config validation error: ${validated.error.message}`);
  }
  return payload;
};

export default configLoader;
