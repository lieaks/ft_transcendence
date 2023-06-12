import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  if (
    !process.env.FORTYTWO_CLIENT_ID ||
    !process.env.FORTYTWO_CLIENT_SECRET ||
    !process.env.FORTYTWO_CALLBACK_URL ||
    !process.env.JWT_SECRET ||
		!process.env.FRONT_URL
  ) {
    return console.error('Missing environment variables!');
  }

  app.use(passport.initialize());

  await app.listen(3000);
}
bootstrap();
