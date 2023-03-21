import {
  ClientTokens,
  configuration,
  rabbitProvider,
  RabbitQueue,
} from '@app/shared-lib/index';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthController, ChatController } from './controllers';
import { AddToRequest } from './middleware/add-to-request.middleware';
import { SessionSerializer } from './serializer';
import { GithubStrategy } from './strategies';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    PassportModule.register({ session: true }),
  ],
  controllers: [AuthController],
  providers: [
    SessionSerializer,
    GithubStrategy,
    rabbitProvider(ClientTokens.AUTH, RabbitQueue.AUTH),
    rabbitProvider(ClientTokens.USER, RabbitQueue.USER),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AddToRequest).forRoutes('*');
  }
}
