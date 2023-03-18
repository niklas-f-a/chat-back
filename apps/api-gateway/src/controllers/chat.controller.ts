import { ClientTokens } from '@app/shared-lib';
import { Controller, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller({
  version: '1',
  path: 'chat',
})
export class ChatController {
  constructor(
    @Inject(ClientTokens.CHAT) private chatClient: ClientProxy,
    @Inject(ClientTokens.USER) private userClient: ClientProxy,
  ) {}
}
