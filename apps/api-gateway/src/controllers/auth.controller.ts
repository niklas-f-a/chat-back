import { ClientTokens } from '@app/shared-lib';
import {
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  Get,
  Inject,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, map, switchMap } from 'rxjs';
import { LoginDto, SignupDto } from '../../../../libs/shared-lib/src/dto';
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
    return this.authClient.send({ cmd: 'signup' }, signUpDto).pipe(
      map((value) => {
        session['user'] = value;
        return value;
      }),
      catchError(() => {
        throw new ConflictException('Something went wrong');
      }),
    );
  }

  @Post('login')
  login(@Session() session: Record<string, any>, @Body() loginDto: LoginDto) {
    return this.authClient.send({ cmd: 'login' }, loginDto).pipe(
      map((value) => {
        session['user'] = value;
        return value;
      }),
      catchError((error) => {
        throw new ForbiddenException(error.message);
      }),
    );
  }
}
