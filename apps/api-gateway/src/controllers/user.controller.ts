import { AuthenticatedGuard, ClientTokens } from '@app/shared-lib';
import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { User } from '../decorators';
import { IUser } from '@app/shared-lib/interfaces';

@UseGuards(AuthenticatedGuard)
@Controller({
  version: '1',
  path: 'users',
})
export class UserController {
  constructor(@Inject(ClientTokens.USER) private userClient: ClientProxy) {}

  @Get('search')
  searchForUser(@Query() query: { users: string; skip?: number }) {
    return this.userClient.send({ cmd: 'search-for-user' }, query);
  }

  @Post('friend-request')
  addFriendRequest(@Body('receiver') receiver: string, @User() user: IUser) {
    return this.userClient.send(
      { cmd: 'add-friend' },
      { requester: user._id, receiver },
    );
  }
}
