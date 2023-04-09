import { AuthenticatedGuard, ClientTokens } from '@app/shared-lib';
import { Controller, Get, Inject, Query, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@UseGuards(AuthenticatedGuard)
@Controller({
  version: '1',
  path: 'users',
})
export class UserController {
  constructor(@Inject(ClientTokens.USER) private userClient: ClientProxy) {}

  @Get('search')
  searchForUser(@Query() query: { users: string; skip?: number }) {
    console.log(query);

    return this.userClient.send({ cmd: 'search-for-user' }, query);
  }
}
