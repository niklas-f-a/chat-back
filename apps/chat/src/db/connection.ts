import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { ChatRoom, ChatSpace, Message, PersonalRoom } from './models';
import { PersonalSpace } from './models/personal-space.model';

export const dbConnection = [
  SequelizeModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => {
      const dbOptions = configService.get('chatDb');

      return {
        dialect: 'postgres',
        ...dbOptions,
        autoLoadModels: true,
        synchronize: true,
        models: [Message, ChatRoom, ChatSpace, PersonalSpace, PersonalRoom],
      };
    },
    inject: [ConfigService],
  }),
];
