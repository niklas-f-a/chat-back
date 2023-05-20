import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, Handshake } from 'socket.io';
import * as sharedsession from 'express-socket.io-session';
import { ForbiddenException, INestApplication } from '@nestjs/common';
import { RequestHandler } from 'express';
import { ClientTokens } from '@app/shared-lib';
import { firstValueFrom } from 'rxjs';
import { User } from 'apps/user/src/schemas';

export class IOAdapter extends IoAdapter {
  constructor(private app: INestApplication, private sess: RequestHandler) {
    super(app);
  }

  findUser(id: string) {
    const userClient = this.app.get(ClientTokens.USER);
    return firstValueFrom<User>(userClient.send({ cmd: 'find-by-id' }, id));
  }

  createIOServer(port: number, options?: any) {
    const server: Server = super.createIOServer(port, options);

    server.use(
      sharedsession(this.sess, {
        autoSave: true,
      }),
    );

    server.use(async (socket, next) => {
      const session = (socket.handshake as Handshake).session as any;
      const id = session?.userId ?? session?.passport?.user?._id;

      try {
        if (!id) throw new ForbiddenException();

        const user = await this.findUser(id);
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
