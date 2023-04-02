import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ChatModule } from './chat.module';
import { IOAdapter } from './IOAdapter';
import * as session from 'express-session';
import { makeStore } from '@app/shared-lib';

async function bootstrap() {
  const app = await NestFactory.create(ChatModule);

  const configService = app.get(ConfigService);
  const rabbitOptions = configService.get('rabbitOptions');
  const mongoCred = configService.get('authDb');
  const sessionCred = configService.get('session') as {
    collection: string;
    secret: string;
  };

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rabbitOptions.url],
      noAck: false,
      queue: rabbitOptions.queue.chat,
      queueOptions: {
        durable: true,
      },
    },
  });

  const sess = session({
    secret: sessionCred.secret,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
    resave: false,
    saveUninitialized: false,
    store: makeStore({
      uri: mongoCred.uri,
      collection: sessionCred.collection,
      sess: session,
    }),
  });

  app.startAllMicroservices();
  app.listen(5050);
  app.useWebSocketAdapter(new IOAdapter(app, sess));
}
bootstrap();
