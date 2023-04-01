import {
  AuthenticatedGuard,
  ClientTokens,
  ChatSpaceDto,
} from '@app/shared-lib';
import { IUser } from '@app/shared-lib/interfaces';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { map, switchMap } from 'rxjs';
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

  @Post()
  createChatSpace(@Body() chatSpaceDto: ChatSpaceDto, @User() user: IUser) {
    const payload = {
      userId: user._id,
      ...chatSpaceDto,
    };

    return this.chatClient
      .send({ cmd: 'add-chat-space' }, payload)
      .pipe(
        switchMap((value) =>
          this.userClient
            .send(
              { cmd: 'add-chat-space' },
              { chatSpaceId: value.chatSpace.id, userId: user._id },
            )
            .pipe(map(() => value)),
        ),
      );
  }

  @Get()
  findAllChatSpaces(@User() user: IUser) {
    return this.chatClient.send(
      { cmd: 'get-chat-space' },
      { chatRoomIds: user.chatSpaces },
    );
  }

  @Delete(':id')
  deleteChatSpace(@Param('id') chatSpaceId: string, @User() user: IUser) {
    return this.chatClient
      .send({ cmd: 'delete-chat-space' }, { chatSpaceId })
      .pipe(
        switchMap(({ message, error }) => {
          if (error) throw new NotFoundException(error);

          return this.userClient
            .send(
              { cmd: 'delete-chat-space' },
              { chatSpaceId, userId: user._id },
            )
            .pipe(map(() => message));
        }),
      );
  }

  @Patch(':id')
  updateChatSpace(
    @Param('id') chatSpaceId: string,
    @Body('name') name: string,
  ) {
    return this.chatClient.send(
      { cmd: 'update-chat-chat-space' },
      { chatSpaceId, name },
    );
  }

  @Get(':id')
  findOne(@Param('id') chatSpaceId: string) {
    return this.chatClient.send({ cmd: 'find-chat-space' }, { chatSpaceId });
  }
}
