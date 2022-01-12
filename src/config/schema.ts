import * as Joi from 'joi';

export const configSchema = Joi.object({
  port: Joi.number().required(),
  httpsPort: Joi.number().required(),
  ssl: Joi.object({
    key: Joi.string().default('ssl/troublor_xyz.key'),
    cert: Joi.string().default('ssl/troublor_xyz.crt'),
    ca: Joi.string().default('ssl/troublor_xyz.ca-bundle'),
  }),
  frontend: Joi.string().default('dist/frontend'),
});
