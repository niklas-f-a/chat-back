import { configuration } from '@app/shared-lib/index';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthController, ChatController } from './controllers';
import { SessionSerializer } from './serializer';
import { GithubStrategy } from './strategies';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    PassportModule.register({ session: true }),
  ],
  controllers: [AuthController, ChatController],
  providers: [SessionSerializer, GithubStrategy],
})
export class AppModule {}
