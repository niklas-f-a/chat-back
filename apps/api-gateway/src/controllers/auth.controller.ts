import { ClientTokens } from '@app/shared-lib';
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  Get,
  Inject,
  InternalServerErrorException,
  Post,
  Redirect,
  Req,
  Res,
  Session,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, map } from 'rxjs';
import { LoginDto, SignupDto } from '../../../../libs/shared-lib/src/dto';
import { GithubAuthGuard } from '../guards';
import { AuthenticatedGuard } from '../../../../libs/shared-lib/src/guards/authenticated.guard';
import { IUser } from '@app/shared-lib/interfaces';
import { Request, Response } from 'express';

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
      map((value: IUser) => {
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
      map((value: IUser) => {
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
  status(@Req() req: Request) {
    return req?.user;
  }

  @UseGuards(AuthenticatedGuard)
  @Post('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    return req.isAuthenticated()
      ? req.logOut((err) => {
          if (err) throw new BadRequestException();
          req.session.destroy((error) => {
            if (error) throw new InternalServerErrorException();
            res.clearCookie('connect.sid').send({ message: 'logged out' });
          });
        })
      : req?.myLogout?.();
  }
}
