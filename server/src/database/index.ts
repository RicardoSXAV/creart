import { createConnection, ConnectionOptions } from 'typeorm';
import { join } from 'path';

const env = process.env.NODE_ENV || 'development';

interface ConfigEnv {
  [key: string]: ConnectionOptions;
}

const ormConfig: ConfigEnv = {
  development: {
    type: 'postgres',
    url: process.env.DATABASE_URL_DEV,
    ssl: true,
    extra: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
    synchronize: true,
    entities: [join(__dirname, '../models/*.ts')],
    migrations: ['./migrations/*.ts'],
    cli: {
      migrationsDir: './migrations',
    },
  },
  test: {
    type: 'sqlite',
    database: '.',
  },
  production: {
    type: 'postgres',
  },
};

createConnection(ormConfig[env]).then(() =>
  console.log('Connected to database!')
);
