import { AuthenticatedGuard, ClientTokens } from '@app/shared-lib';
import { IUser } from '@app/shared-lib/interfaces';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, map, of, switchMap } from 'rxjs';
import { User } from '../decorators';

@UseGuards(AuthenticatedGuard)
@Controller({
  version: '1',
  path: 'chat',
})
export class ChatController {
  constructor(
    @Inject(ClientTokens.CHAT) private chatClient: ClientProxy,
    @Inject(ClientTokens.USER) private userClient: ClientProxy,
  ) {}

  // @Post()
  // createChatRoom(@Body() chatRoomDto: ChatRoomDto, @User() user: RIUser) {
  //   const payload = {
  //     userId: user.sub,
  //     ...chatRoomDto,
  //   };
  //   return this.chatClient.send({ cmd: 'add-chat-room' }, payload).pipe(
  //     map((value) => ({ chatRoomId: value.id, userId: user.sub })),
  //     switchMap((value) =>
  //       this.userClient.send({ cmd: 'add-chat-room' }, { ...value }),
  //     ),
  //   );
  // }

  @Get()
  findAllChatRooms(@User() user: IUser) {
    return this.userClient
      .send({ cmd: 'find-by-id' }, user._id)
      .pipe(
        switchMap((value) =>
          this.chatClient.send(
            { cmd: 'get-chat-rooms' },
            { chatRoomIds: value.chatRooms },
          ),
        ),
      );
  }

  // @Delete(':id')
  // deleteChatRoom(@Param('id') roomId: string, @User() user: RIUser) {
  //   return this.chatClient.send({ cmd: 'delete-chat-room' }, { roomId }).pipe(
  //     switchMap(({ error }) => {
  //       if (error) return error;

  //       this.userClient.send(
  //         { cmd: 'delete-chat-room' },
  //         { roomId, userId: user.sub },
  //       );
  //     }),
  //   );
  // }

  // @Patch(':id')
  // updateChatRoom(@Param('id') roomId: string, @Body('name') name: ChatRoomDto) {
  //   return this.chatClient.send({ cmd: 'update-chat-room' }, { roomId, name });
  // }

  // // testing send roomid to get all messages with room
  // @Get(':id')
  // findOne(@Param('id') roomId: string) {
  //   return this.chatClient.send({ cmd: 'find-chat-room' }, { roomId });
  // }
}
