import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ClientTokens, RabbitQueue } from '../config/constants';

export default (service: ClientTokens, rabbitQueue: RabbitQueue) => ({
  provide: service,
  useFactory: (configService: ConfigService) => {
    const { url, queue } = configService.get('rabbitOptions') as {
      url: string;
      queue: { auth: string; chat: string; user: string };
    };

    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [url],
        queue: queue[rabbitQueue],
        queueOptions: {
          durable: true,
        },
      },
    });
  },
  inject: [ConfigService],
});
