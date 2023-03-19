import { Strategy } from 'passport-github2';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { Profile } from 'passport';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ClientTokens } from '@app/shared-lib';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(@Inject(ClientTokens.USER) private userClient: ClientProxy) {
    super({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      scope: ['public_profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const { id: githubId, username, photos } = profile;

    return await firstValueFrom(
      this.userClient.send(
        { cmd: 'find-or-create-github-user' },
        {
          githubId,
          username,
          photos,
        },
      ),
    );
  }
}
