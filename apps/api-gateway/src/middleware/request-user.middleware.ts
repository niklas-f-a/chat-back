import { ClientTokens } from '@app/shared-lib';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NestMiddleware,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { NextFunction, Request, Response } from 'express';
import { firstValueFrom, map } from 'rxjs';

export interface IRequest extends Request {
  isLoggedIn: () => boolean;
  myLogout: () => any;
}

@Injectable()
export class RequestUser implements NestMiddleware {
  constructor(
    @Inject(ClientTokens.USER) private readonly userClient: ClientProxy,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const { userId } = req?.session as unknown as Record<string, string>;
    if (userId) {
      const user = await firstValueFrom(
        this.userClient
          .send({ cmd: 'find-by-id' }, userId)
          .pipe(map((value) => value)),
      );

      req['user'] = user;
    }
    req.isLoggedIn = () => !!req?.user;
    req.myLogout = () =>
      req?.session?.destroy((err) => {
        if (err) throw new InternalServerErrorException();
        delete req?.user;
        res.clearCookie('connect.sid').send({ message: 'logged out' });
      });

    next();
  }
}
