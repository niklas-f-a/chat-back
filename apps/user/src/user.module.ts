import { configuration, ServiceTokens, SharedModule } from '@app/shared-lib';
import { UsersRepository } from '@app/shared-lib/repositories';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    SharedModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        if (process.env.NODE_ENV !== 'test') {
          const { uri } = configService.get('authDb') as { uri: string };

          return { uri };
        }
      },
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [
    {
      provide: ServiceTokens.USER,
      useClass: UserService,
    },
    {
      provide: UsersRepository.name,
      useClass: UsersRepository,
    },
  ],
})
export class UserModule {}
