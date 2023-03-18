import { ClientTokens } from '@app/shared-lib';
import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { GithubAuthGuard } from '../guards';

@Controller({
  version: '1',
  path: 'auth',
})
export class AuthController {
  constructor(
    @Inject(ClientTokens.AUTH) private authClient: ClientProxy,
    @Inject(ClientTokens.USER) private userClient: ClientProxy,
  ) {}

  @Get('github/login')
  @UseGuards(GithubAuthGuard)
  loginGithub() {
    return;
  }

  @Get('/github/callback')
  @UseGuards(GithubAuthGuard)
  authCallback() {
    return { message: 'ok' };
  }
}
