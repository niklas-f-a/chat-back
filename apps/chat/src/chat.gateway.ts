import { Inject, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
// import { AuthenticatedGuard } from 'apps/auth/src/guards';
import { Server, Socket } from 'socket.io';
import { ChatRoom, ChatSpace } from './db/models';
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
  socket: Socket;

  onModuleInit() {
    this.server.on('connection', async (socket) => {
      console.log('connected');
      this.socket = socket;
      const spaceIds = socket.handshake.auth.chatSpaces;
      const chatSpacePromises = spaceIds.map((spaceId: string) =>
        this.chatService.findOneChatSpace(spaceId),
      );
      const spaces = await Promise.all(chatSpacePromises);
      spaces.forEach((space) => {
        space.chatRooms.forEach((room: ChatRoom) => {
          socket.join(room.id.toString());
        });
      });
    });
  }

  @SubscribeMessage('send-message')
  async sendMessage(@MessageBody() data: { roomId: number; content: string }) {
    const userId = this.socket.handshake.auth._id as string;
    const message = await this.chatService.addMessage({ ...data, userId });
    console.log(message);

    this.server.to(data.roomId.toString()).emit('received-message', message);
  }
}
