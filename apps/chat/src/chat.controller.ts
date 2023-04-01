import {
  ChatSpacePayload,
  ServiceTokens,
  SharedService,
} from '@app/shared-lib';
import { Controller, Inject } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { ChatService } from './chat.service';

@Controller()
export class ChatController {
  constructor(
    @Inject(ServiceTokens.CHAT) private chatService: ChatService,
    private readonly sharedService: SharedService,
  ) {}
  @MessagePattern({ cmd: 'add-chat-space' })
  async createChatRoom(
    @Payload() chatSpacePayload: ChatSpacePayload,
    @Ctx() context: RmqContext,
  ) {
    this.sharedService.rabbitAck(context);
    return this.chatService.createChatSpace(chatSpacePayload);
  }

  @MessagePattern({ cmd: 'get-chat-space' })
  getAllChatSpaces(
    @Payload('chatRoomIds') chatRoomIds: string[],
    @Ctx() context: RmqContext,
  ) {
    this.sharedService.rabbitAck(context);
    return this.chatService.getAllChatSpaces(chatRoomIds);
  }

  @MessagePattern({ cmd: 'find-chat-space' })
  findOneChatSpaces(
    @Payload('roomId') chatSpaceId: string,
    @Ctx() context: RmqContext,
  ) {
    this.sharedService.rabbitAck(context);
    return this.chatService.findOneChatSpace(chatSpaceId);
  }

  @MessagePattern({ cmd: 'delete-chat-space' })
  async deleteChatSpace(
    @Payload('chatSpaceId') chatSpaceId: string,
    @Ctx() context: RmqContext,
  ) {
    this.sharedService.rabbitAck(context);
    return await this.chatService.deleteChatSpace(chatSpaceId);
  }

  @MessagePattern({ cmd: 'update-chat-chat-space' })
  async updateChatSpace(
    @Payload() payload: { chatSpaceId: string; name: string },
    @Ctx() context: RmqContext,
  ) {
    this.sharedService.rabbitAck(context);
    return await this.chatService.updateChatSpace(payload);
  }
}
