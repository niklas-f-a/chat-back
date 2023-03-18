import { ClientTokens } from '@app/shared-lib';
import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { map, switchMap } from 'rxjs';
import { SignupDto } from '../../../../libs/shared-lib/src/dto';
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

  // @Get('github/login')
  // @UseGuards(GithubAuthGuard)
  // loginGithub() {
  //   return;
  // }

  // @Get('/github/callback')
  // @UseGuards(GithubAuthGuard)
  // authCallback() {
  //   return { message: 'ok' };
  // }

  @Post('signup')
  signup(
    @Session() session: Record<string, any>,
    @Body() signUpDto: SignupDto,
  ) {
    return this.userClient.send({ cmd: 'sign-up' }, signUpDto).pipe(
      map((value) => {
        // if (value.status === 409) {
        //   throw value.response;
        // }
        return value;
      }),
      // switchMap(({ email }) =>
      //   this.authClient.send(
      //     { cmd: 'login' },
      //     { email, password: signUpDto.password },
      //   ),
      // ),
      // map((value) => {
      //   session['access_token'] = value.access_token;
      //   return { message: 'ok' };
      // }),
    );
  }
}
