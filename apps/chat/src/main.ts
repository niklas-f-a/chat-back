import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ChatModule } from './chat.module';
// import { IOAdapter } from './IO.adabter';
import * as session from 'express-session';
// import { makeMongo } from '@app/shared/providers';

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

  // const sess = session({
  //   secret: sessionCred.secret,
  //   cookie: {
  //     maxAge: 1000 * 60 * 60 * 24, // 1 day
  //   },
  //   resave: false,
  //   saveUninitialized: false,
  //   store: makeMongo({
  //     uri: mongoCred.uri,
  //     collection: sessionCred.collection,
  //     session,
  //   }),
  // });

  // app.useWebSocketAdapter(new IOAdapter(app, sess));

  app.startAllMicroservices();
  app.listen(5050);
}
bootstrap();
