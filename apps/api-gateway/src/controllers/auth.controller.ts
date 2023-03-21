import { ClientTokens } from '@app/shared-lib';
import {
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  Get,
  Inject,
  Post,
  Redirect,
  Req,
  Session,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { User } from 'apps/user/src/schemas';
import { catchError, map } from 'rxjs';
import { LoginDto, SignupDto } from '../../../../libs/shared-lib/src/dto';
import { GithubAuthGuard } from '../guards';
import { AuthenticatedGuard } from '../guards/authenticated.guard';
// import { AuthenticatedGuard } from '../guards/authenticated.guard';

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

  @Get('github/callback')
  @UseGuards(GithubAuthGuard)
  @Redirect('http://localhost:5173', 301)
  authCallback() {
    return { message: 'ok' };
  }

  @Post('signup')
  signup(
    @Session() session: Record<string, any>,
    @Body() signUpDto: SignupDto,
  ) {
    return this.authClient.send({ cmd: 'signup' }, signUpDto).pipe(
      map((value: User) => {
        session['userId'] = value?._id;
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
      map((value: User) => {
        session['userId'] = value?._id;
        return value;
      }),
      catchError((error) => {
        throw new ForbiddenException(error.message);
      }),
    );
  }

  @UseGuards(AuthenticatedGuard)
  @Get('status')
  status(@Session() session: Record<string, any>, @Req() req: any) {
    return req?.user;
  }
}
