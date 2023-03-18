import {
  ClientTokens,
  configuration,
  rabbitProvider,
  RabbitQueue,
} from '@app/shared-lib/index';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthController, ChatController } from './controllers';
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
export class AppModule {}
