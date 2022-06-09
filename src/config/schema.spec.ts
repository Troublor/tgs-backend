import { DatabaseConfig, LogConfig, NotifierBotConfig } from './schema';
import { validateOrReject } from 'class-validator';

describe('Config schema', () => {
  it('should not throw error when an optional field is missing', async () => {
    const logCfg = {
      level: 'debug',
    };
    const cfg = Object.assign(new LogConfig(), logCfg);
    await expect(validateOrReject(cfg)).resolves.toBeUndefined();
  });
  it('should throw not throw error when a field with default value is missing', async () => {
    const logCfg = {};
    const cfg = Object.assign(new LogConfig(), logCfg);
    await expect(validateOrReject(cfg)).resolves.toBeUndefined();
  });
  it('should throw error when a required field is missing', async () => {
    const cfg = Object.assign(new NotifierBotConfig(), {});
    await expect(validateOrReject(cfg)).rejects.toHaveLength(1);
  });
  it('should throw error when field type not match', async () => {
    const cfg = Object.assign(new DatabaseConfig(), {
      port: '1234',
    });
    await expect(validateOrReject(cfg)).rejects.toHaveLength(1);
  });
});
