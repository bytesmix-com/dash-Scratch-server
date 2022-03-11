import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import * as http from 'http';
import * as https from 'https';
import { AppModule } from './app.module';
import * as fs from 'fs';
import { join } from 'path';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieParser = require('cookie-parser');
// eslint-disable-next-line @typescript-eslint/no-var-requires
import * as bodyParser from 'body-parser';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

async function bootstrap() {
  const server = express();

  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  app.use(cookieParser());
  app.enableCors({
    origin: [
      "https://dash.dongseo.ac.kr",
      "https://one-dash.dongseo.ac.kr",
      "https://dash.dongseo.ac.kr:82",
      'https://api-local.stg-scratch-tutoring.app:3001',
      'https://stg-scratch-tutoring.app',
      'https://scratch-tutoring.app',
      'https://studio.apollographql.com',
      'https://local.stg-branch.be:8001',
      'https://local.stg-branch.be:8000',
      'https://local.stg-branch.be:8002',
      'https://scratch-tutoring-web-app.stg-branch.be',
      'https://scratch-tutoring-web-gui.stg-branch.be',
      'https://scratch-tutoring-web-admin.stg-branch.be',
      'https://local.stg-branch.be:8003',
      /\.stg-branch\.be:?d*$/,
    ],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  app.useGlobalPipes(new ValidationPipe());

  await app.init();

  http.createServer(server).listen(process.env.PORT || 3000);

  if (process.env.NODE_ENV == 'development') {
    https
      .createServer(
        {
          key: fs.readFileSync(join(process.cwd(), './key.pem')),
          cert: fs.readFileSync(join(process.cwd(), './cert.pem')),
        },
        server,
      )
      .listen(process.env.HTTPS_PORT || 3001);
  }
}

bootstrap();
