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
import { ChatRoom, ChatSpace, Message, PersonalRoom } from './db/models';
import { ChatGateway } from './chat.gateway';
import { PersonalSpace } from './db/models/personal-space.model';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    ...dbConnection,
    SequelizeModule.forFeature([
      ChatRoom,
      Message,
      ChatSpace,
      PersonalSpace,
      PersonalRoom,
    ]),
  ],
  controllers: [ChatController],
  providers: [
    ChatGateway,
    SharedService,
    { provide: ServiceTokens.CHAT, useClass: ChatService },
    rabbitProvider(ClientTokens.USER, RabbitQueue.USER),
    rabbitProvider(ClientTokens.AUTH, RabbitQueue.AUTH),
  ],
})
export class ChatModule {}
