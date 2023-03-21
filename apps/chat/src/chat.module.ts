import {
  configuration,
  SharedService,
  rabbitProvider,
  ServiceTokens,
  ClientTokens,
  RabbitQueue,
} from '@app/shared-lib';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { dbConnection } from './db/connection';
import { ChatRoom, Message } from './db/models';
import { GatewayModule } from './gateway/gateway.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    GatewayModule,
    SequelizeModule.forFeature([ChatRoom, Message]),
    ...dbConnection,
  ],
  controllers: [ChatController],
  providers: [
    SharedService,
    { provide: ServiceTokens.CHAT, useClass: ChatService },
    rabbitProvider(ClientTokens.USER, RabbitQueue.USER),
    rabbitProvider(ClientTokens.AUTH, RabbitQueue.AUTH),
  ],
})
export class ChatModule {}
