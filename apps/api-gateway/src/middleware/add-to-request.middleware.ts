import { ClientTokens } from '@app/shared-lib';
import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { NextFunction, Request, Response } from 'express';
import { firstValueFrom, map } from 'rxjs';

interface IRequest extends Request {
  isLoggedIn: () => boolean;
}

@Injectable()
export class AddToRequest implements NestMiddleware {
  constructor(
    @Inject(ClientTokens.USER) private readonly userClient: ClientProxy,
  ) {}
  async use(req: Request, _: Response, next: NextFunction) {
    const { userId } = req?.session as unknown as Record<string, string>;
    if (userId) {
      const user = await firstValueFrom(
        this.userClient
          .send({ cmd: 'find-by-id' }, userId)
          .pipe(map((value) => value)),
      );

      req['user'] = user;
    }
    (req as IRequest).isLoggedIn = () => !!req?.user;

    next();
  }
}
