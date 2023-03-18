import { ClientTokens } from '@app/shared-lib';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PassportSerializer } from '@nestjs/passport';
import { firstValueFrom, map } from 'rxjs';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(@Inject(ClientTokens.USER) private userService: ClientProxy) {
    super();
  }

  serializeUser(user: any, done: (err: Error | null, user: any) => void) {
    // Change stored value and fix deserialization

    done(null, user);
  }

  async deserializeUser(
    user: any,
    done: (err: Error | null, user: any) => void,
  ) {
    const foundUser = await firstValueFrom(
      this.userService
        .send({ cmd: 'find-github-user' }, user?.githubId)
        .pipe(map((value) => value)),
    );

    return foundUser ? done(null, foundUser) : done(null, null);
  }
}
