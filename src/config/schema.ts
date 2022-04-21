import Joi from 'joi';

export const configSchema = Joi.object({
  port: Joi.number().required(),
  httpsPort: Joi.number().required(),
  log: Joi.object({
    level: Joi.string().valid('debug', 'info', 'warn', 'error').default('info'),
    file: Joi.string(),
  }),
  'notifier-bot': Joi.object({
    token: Joi.string(),
    userChatMap: Joi.string().default('userChatMap.json'),
  }),
  ssl: Joi.object({
    key: Joi.string().default('ssl/troublor_xyz.key'),
    cert: Joi.string().default('ssl/troublor_xyz.crt'),
    ca: Joi.string().default('ssl/troublor_xyz.ca-bundle'),
  }),
  auth: Joi.object({
    secret: Joi.string().default('secret'),
  }),
  frontend: Joi.string().default('dist/frontend'),
});
