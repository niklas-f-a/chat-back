import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { ChatRoom, Message } from './models';

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
        models: [Message, ChatRoom],
      };
    },
    inject: [ConfigService],
  }),
];
