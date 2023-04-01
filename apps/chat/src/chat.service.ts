// import { ChatRoomDto } from '@app/shared/dto';
import { ChatSpacePayload } from '@app/shared-lib';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/sequelize';
import { catchError, concatMap, from, toArray } from 'rxjs';
import { ChatRoom, ChatSpace, Message } from './db/models';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(ChatRoom) private chatRoomModel: typeof ChatRoom,
    @InjectModel(Message) private messageModel: typeof Message,
    @InjectModel(ChatSpace) private chatSpaceModel: typeof ChatSpace,
  ) {}

  async createChatSpace(chatRoomDto: ChatSpacePayload) {
    const chatSpace = await this.chatSpaceModel.create({
      ...chatRoomDto,
      createdBy: chatRoomDto.userId,
    });

    const chatRoom = await this.chatRoomModel.create({
      chatSpaceId: chatSpace.id,
    });

    return { chatSpace, chatRoom };
  }

  getAllChatSpaces(chatSpaceIds: string[]) {
    return from(chatSpaceIds).pipe(
      concatMap((value) => this.findOneChatSpace(value)),
      toArray(),
      catchError((error) => {
        throw new RpcException(error.message);
      }),
    );
  }

  async findOneChatSpace(chatRoomId: string) {
    return this.chatSpaceModel.findByPk(chatRoomId, {
      include: ChatRoom,
    });
  }

  async deleteChatSpace(chatSpaceId: string) {
    // delete chat rooms and messages

    // await this.chatRoomModel.destroy({
    //   where: { chatSpaceId },
    // });

    const roomsDeleted = await this.chatSpaceModel.destroy({
      where: { id: chatSpaceId },
    });

    if (roomsDeleted > 0) {
      return { message: `room with id: ${chatSpaceId} was deleted` };
    }
    return new RpcException(`Could not delete room with id: ${chatSpaceId}`);
  }

  async updateChatSpace({
    chatSpaceId,
    name,
  }: {
    chatSpaceId: string;
    name: string;
  }) {
    const chatSpace = await this.findOneChatSpace(chatSpaceId);
    if (!chatSpace) {
      throw new RpcException('Resource not found');
    }
    chatSpace.name = name;
    return chatSpace?.save();
  }
}
