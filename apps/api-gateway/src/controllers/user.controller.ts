import { AuthenticatedGuard, ClientTokens } from '@app/shared-lib';
import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@UseGuards(AuthenticatedGuard)
@Controller({
  version: '1',
  path: 'USER',
})
export class UserController {
  constructor(@Inject(ClientTokens.USER) private userClient: ClientProxy) {}

  @Post('search')
  searchForUser(@Body('searchTerm') searchTerm: string) {
    return this.userClient.send({ cmd: 'search-for-user' }, searchTerm);
  }
}
