import { IsString } from 'class-validator';

export class ChatSpaceDto {
  @IsString()
  name: string;
}

export class ChatSpacePayload extends ChatSpaceDto {
  userId: string;
}
