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
import { IUser } from '@app/shared-lib/interfaces';

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
    @Payload('chatSpaceId') chatSpaceId: string,
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

  @MessagePattern({ cmd: 'get-chat-room' })
  findChatRoomById(@Ctx() context: RmqContext, @Payload() id: number) {
    this.sharedService.rabbitAck(context);
    return this.chatService.getRoomById(id);
  }

  @MessagePattern({ cmd: 'add-message' })
  addMessage(
    @Ctx() context: RmqContext,
    @Payload() payload: { roomId: number; userId: string; content: string },
  ) {
    this.sharedService.rabbitAck(context);
    return this.chatService.addMessage(payload);
  }

  @MessagePattern({ cmd: 'create-room' })
  addChatRoom(
    @Ctx() context: RmqContext,
    @Payload() { name, chatSpaceId }: { name: string; chatSpaceId: string },
  ) {
    this.sharedService.rabbitAck(context);
    return this.chatService.createRoom(chatSpaceId, name);
  }

  @MessagePattern({ cmd: 'create-personal-space' })
  createPersonalChatRoom(
    @Ctx() context: RmqContext,
    @Payload('userId') userId: string,
  ) {
    this.sharedService.rabbitAck(context);
    return this.chatService.createPersonalSpace(userId);
  }

  @MessagePattern({ cmd: 'find-personal-space' })
  findPersonalChatRoom(@Ctx() context: RmqContext, @Payload('id') id: string) {
    this.sharedService.rabbitAck(context);
    return this.chatService.findPersonalSpace(id);
  }

  @MessagePattern({ cmd: 'create-personal-room' })
  createPersonalRoom(
    @Ctx() context: RmqContext,
    @Payload()
    {
      receivingUser,
      requestingUser,
    }: { receivingUser: IUser; requestingUser: IUser },
  ) {
    this.sharedService.rabbitAck(context);
    return this.chatService.createPersonalRoom(receivingUser, requestingUser);
  }
}
