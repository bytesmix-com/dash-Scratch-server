import { join } from 'path';
import { ConnectionOptions } from 'typeorm';
export = {
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: false,
  logging: ['warn', 'error'],
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  cli: {
    entitiesDir: join(__dirname, '/entities'),
    migrationsDir: join(__dirname, '/migrations'),
  },
} as ConnectionOptions;
