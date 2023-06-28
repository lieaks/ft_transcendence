import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as passport from 'passport';
import { urlencoded, json } from 'express';

if (
  !process.env.FORTYTWO_CLIENT_ID ||
  !process.env.FORTYTWO_CLIENT_SECRET ||
  !process.env.GOOGLE_CLIENT_ID ||
  !process.env.GOOGLE_CLIENT_SECRET ||
  !process.env.CALLBACK_URL ||
  !process.env.DEFAULT_FRONTEND_URL ||
  !process.env.JWT_SECRET ||
  !process.env.DATABASE_URL
) {
  console.error('Missing environment variables!');
  process.exit(1);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.use(passport.initialize());
  app.use(json({ limit: '1mb' }));
  app.use(urlencoded({ limit: '1mb', extended: true }));

  await app.listen(3000);
}
bootstrap();
