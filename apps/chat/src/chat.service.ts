// import { ChatRoomDto } from '@app/shared/dto';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
// import { InjectModel } from '@nestjs/sequelize';
import { catchError, concatMap, from, toArray } from 'rxjs';
import { ChatRoom, Message } from './db/models';

@Injectable()
export class ChatService {
  constructor(
    //     @InjectModel(ChatRoom)
    private chatRoomModel: typeof ChatRoom, //     @InjectModel(Message) //     private messageModel: typeof Message,
  ) {}

  //   async createChatRoom(chatRoomDto: ChatRoomDto) {
  //     return await this.chatRoomModel.create({
  //       ...chatRoomDto,
  //       createdBy: chatRoomDto.userId,
  //     });
  //   }

  getAllChatRooms(chatRoomIds: string[]) {
    return from(chatRoomIds).pipe(
      concatMap((value) => this.chatRoomModel.findByPk(value)),
      toArray(),
      catchError((error) => {
        throw new RpcException(error.message);
      }),
    );
  }

  //   addMessage() {
  //     return this.messageModel.create({
  //       message: 'kkakaka',
  //       userId: 1,
  //       roomId: 4,
  //     });
  //   }

  //   findOneChatRoom(chatRoomId: string) {
  //     return this.chatRoomModel.findByPk(chatRoomId, { include: [Message] });
  //   }

  //   async deleteChatRoom(roomId: string) {
  //     await this.messageModel.destroy({
  //       where: { roomId },
  //     });

  //     const roomsDeleted = await this.chatRoomModel.destroy({
  //       where: { id: roomId },
  //     });

  //     if (roomsDeleted > 0) {
  //       return { message: `room with id: ${roomId} was deleted` };
  //     }
  //     return new RpcException(`Could not delete room with id: ${roomId}`);
  //   }

  //   async updateChatRoom({ roomId, name }: any) {
  //     return this.chatRoomModel.update({ name }, { where: { id: roomId } });
  //   }
}
