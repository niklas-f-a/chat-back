import {
  configuration,
  ServiceTokens,
  SharedService,
  rabbitProvider,
  ClientTokens,
  RabbitQueue,
} from '@app/shared-lib';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    SharedService,
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: ServiceTokens.AUTH,
      useClass: AuthService,
    },
    rabbitProvider(ClientTokens.USER, RabbitQueue.USER),
  ],
})
export class AuthModule {}
