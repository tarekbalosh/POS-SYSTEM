import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { bootstrap } from '../src/main';

const server = express();

let cachedApp: any;

export default async (req: any, res: any) => {
  if (!cachedApp) {
    cachedApp = await bootstrap();
  }
  const instance = cachedApp.getHttpAdapter().getInstance();
  instance(req, res);
};
