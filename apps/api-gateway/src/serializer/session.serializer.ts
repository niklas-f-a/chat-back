import { ClientTokens } from '@app/shared-lib';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PassportSerializer } from '@nestjs/passport';
import { User } from 'apps/user/src/schemas';
import { firstValueFrom, map } from 'rxjs';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(@Inject(ClientTokens.USER) private userClient: ClientProxy) {
    super();
  }

  serializeUser(user: User, done: (err: Error | null, user: User) => void) {
    done(null, user);
  }

  async deserializeUser(
    user: User,
    done: (err: Error | null, user: User | null) => void,
  ) {
    const foundUser = await firstValueFrom(
      this.userClient
        .send({ cmd: 'find-by-github-id' }, user?.githubId)
        .pipe(map((value) => value)),
    );

    return foundUser ? done(null, foundUser) : done(null, null);
  }
}
