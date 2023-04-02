import { Inject, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
// import { AuthenticatedGuard } from 'apps/auth/src/guards';
import { Server } from 'socket.io';
import { ChatSpace } from './db/models';
import { ChatService } from './chat.service';
import { ServiceTokens } from '@app/shared-lib';
import { from, of, switchMap, tap } from 'rxjs';

@WebSocketGateway({
  cors: {
    origin: ['http://127.0.0.1:5173', 'http://localhost:5173'],
    credentials: true,
  },
})
export class ChatGateway implements OnModuleInit {
  constructor(@Inject(ServiceTokens.CHAT) private chatService: ChatService) {}
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', async (socket) => {
      console.log('connected');
      const spaceIds = socket.handshake.auth.chatSpaces;
      const chatSpacePromises = spaceIds.map((spaceId: string) =>
        this.chatService.findOneChatSpace(spaceId),
      );
      const space = await this.chatService.findOneChatSpace(spaceIds[0]);
      console.log(space?.chatRooms);
      // console.log(socket.handshake);
    });
  }

  @SubscribeMessage('sendMessage')
  sendMessage(@MessageBody() body: any) {
    // console.log(body);
    this.server.emit('pong');
  }
}
