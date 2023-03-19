import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { makeMongo } from '@app/shared-lib/store/mongo.store';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [`http://127.0.0.1:5173`, `http://localhost:5173`],
    methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
    credentials: true,
  });
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const configService = app.get(ConfigService);
  const port = configService.get('port');
  const mongoCred = configService.get('authDb');
  const sessionCred = configService.get('session') as {
    collection: string;
    secret: string;
  };

  const store =
    process.env.NODE_ENV === 'production'
      ? makeMongo({
          uri: mongoCred.uri,
          collection: sessionCred.collection,
          sess: session,
        })
      : undefined;

  app.use(
    session({
      secret: sessionCred.secret,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
      },
      resave: false,
      saveUninitialized: false,
      store,
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(port);
}
bootstrap();
