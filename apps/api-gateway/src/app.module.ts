import {
  ClientTokens,
  configuration,
  rabbitProvider,
  RabbitQueue,
} from '@app/shared-lib/index';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthController, ChatController, UserController } from './controllers';
import { RequestUser } from './middleware';
import { SessionSerializer } from './serializer';
import { GithubStrategy } from './strategies';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    PassportModule.register({ session: true }),
  ],
  controllers: [AuthController, ChatController, UserController],
  providers: [
    SessionSerializer,
    GithubStrategy,
    rabbitProvider(ClientTokens.AUTH, RabbitQueue.AUTH),
    rabbitProvider(ClientTokens.USER, RabbitQueue.USER),
    rabbitProvider(ClientTokens.CHAT, RabbitQueue.CHAT),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestUser).forRoutes('*');
  }
}
