import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server } from 'socket.io';
import * as sharedsession from 'express-socket.io-session';
import { ForbiddenException, INestApplication } from '@nestjs/common';
import { RequestHandler } from 'express';
import { Session } from 'express-session';
import { ClientTokens } from '@app/shared-lib';
import { firstValueFrom, map } from 'rxjs';
import { User } from 'apps/user/src/schemas';

export class IOAdapter extends IoAdapter {
  constructor(private app: INestApplication, private sess: RequestHandler) {
    super(app);
  }

  findUser(id: string) {
    const userClient = this.app.get(ClientTokens.USER);
    // find user from github id also
    return firstValueFrom<User>(userClient.send({ cmd: 'find-by-id' }, id));
  }

  createIOServer(port: number, options?: any): any {
    const server: Server = super.createIOServer(port, options);

    server.use(
      sharedsession(this.sess, {
        autoSave: true,
      }),
    );

    server.use(async (socket, next) => {
      const session = (socket.handshake as any).session as any;
      try {
        if (!session?.userId) throw new ForbiddenException();
        const user = await this.findUser(session?.userId);
        if (!user) throw new ForbiddenException();
        socket.handshake.auth = user;
        next();
      } catch {
        next(new ForbiddenException());
      }
    });
    return server;
  }
}
