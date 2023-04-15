// import { ChatRoomDto } from '@app/shared/dto';
import { ChatSpacePayload } from '@app/shared-lib';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { catchError, concatMap, from, toArray } from 'rxjs';
import {
  ChatRoom,
  ChatSpace,
  Message,
  PersonalRoom,
  PersonalSpace,
} from './db/models';
import { InjectModel } from '@nestjs/sequelize';
import { FriendRequest, IUser } from '@app/shared-lib/interfaces';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(ChatRoom) private chatRoomModel: typeof ChatRoom,
    @InjectModel(Message) private messageModel: typeof Message,
    @InjectModel(ChatSpace) private chatSpaceModel: typeof ChatSpace,
    @InjectModel(PersonalRoom) private personalRoomModel: typeof PersonalRoom,
    @InjectModel(PersonalSpace)
    private personalSpaceModel: typeof PersonalSpace,
  ) {}

  async createChatSpace(chatRoomDto: ChatSpacePayload) {
    const chatSpace = await this.chatSpaceModel.create({
      ...chatRoomDto,
      createdBy: chatRoomDto.userId,
    });

    const chatRoom = await this.createRoom(chatSpace.id);

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

  async getRoomById(id: number) {
    try {
      const room = await this.chatRoomModel.findByPk(id, { include: Message });
      if (!room) throw new RpcException('Not found');

      return room;
    } catch (error) {
      throw new RpcException('Not Found');
    }
  }

  async addMessage(data: { roomId: number; userId: string; content: string }) {
    const { roomId, userId, content } = data;
    try {
      const room = await this.getRoomById(data.roomId);

      const message = await this.messageModel.create({
        userId,
        content,
        roomId,
      });
      room.messages.push(message);
      await room.save();

      return message;
    } catch (error) {
      console.log(error);
    }
  }

  async createRoom(chatSpaceId: string, name?: string) {
    const chatSpace = await this.findOneChatSpace(chatSpaceId);
    if (!chatSpace) throw new RpcException('Not found');

    const chatRoom = await this.chatRoomModel.create({
      chatSpaceId: chatSpace.id,
      name,
    });

    return chatRoom;
  }

  async createPersonalSpace(userId: string) {
    const personalSpace = await this.personalSpaceModel.create({ userId });

    return personalSpace;
  }

  async createPersonalRoom(requester: IUser, receiver: IUser) {
    const chatRoom = await this.chatRoomModel.create();

    const requestingRoom = await this.personalRoomModel.create({
      personalSpaceId: requester.personalSpace,
      chatRoomId: chatRoom.id,
      user1: requester.username,
      user2: receiver.username,
    });

    await this.personalRoomModel.create({
      personalSpaceId: receiver.personalSpace,
      chatRoomId: chatRoom.id,
      user1: requester.username,
      user2: receiver.username,
    });

    return requestingRoom;
  }

  findPersonalSpace(id: string) {
    return this.personalSpaceModel.findByPk(id, {
      include: ChatRoom,
    });
  }
}
