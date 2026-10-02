import fs from 'node:fs';
import path from 'node:path';
import { Sequelize } from 'sequelize';
import { env } from '../config/env';

const IN_MEMORY = ':memory:';

if (env.DB_STORAGE !== IN_MEMORY) {
  fs.mkdirSync(path.dirname(path.resolve(env.DB_STORAGE)), { recursive: true });
}

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: env.DB_STORAGE,
  logging: false,
});
