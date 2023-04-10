import { AuthenticatedGuard, ClientTokens } from '@app/shared-lib';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { User } from '../decorators';
import { IUser } from '@app/shared-lib/interfaces';
import { catchError } from 'rxjs';

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
    console.log();

    return this.userClient
      .send({ cmd: 'add-friend' }, { requester: user._id, receiver })
      .pipe(
        catchError(() => {
          throw new BadRequestException();
        }),
      );
  }

  @Get('friends')
  getFriends(@User() user: IUser) {
    return this.userClient.send({ cmd: 'get-friends' }, { userId: user._id });
  }

  @Post('friends/accept')
  acceptFriendRequest(@Body('requestId') requestId: string) {
    return this.userClient.send({ cmd: 'accept-request' }, { requestId }).pipe(
      catchError(() => {
        throw new NotFoundException();
      }),
    );
  }
}
