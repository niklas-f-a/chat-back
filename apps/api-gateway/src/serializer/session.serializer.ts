import { ClientTokens } from '@app/shared-lib';
import { IUser } from '@app/shared-lib/interfaces';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PassportSerializer } from '@nestjs/passport';
import { firstValueFrom, map } from 'rxjs';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(@Inject(ClientTokens.USER) private userClient: ClientProxy) {
    super();
  }

  serializeUser(user: IUser, done: (err: Error | null, user: IUser) => void) {
    done(null, user);
  }

  async deserializeUser(
    user: IUser,
    done: (err: Error | null, user: IUser | null) => void,
  ) {
    const foundUser = await firstValueFrom(
      this.userClient
        .send({ cmd: 'find-by-github-id' }, user?.githubId)
        .pipe(map((value) => value)),
    );

    return foundUser ? done(null, foundUser) : done(null, null);
  }
}
