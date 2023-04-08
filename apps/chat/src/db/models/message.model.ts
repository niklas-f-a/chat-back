import {
  BelongsTo,
  Column,
  CreatedAt,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { ChatRoom } from '.';

@Table
export class Message extends Model {
  @Column
  content: string;

  @Column
  userId: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updateAt: Date;

  @ForeignKey(() => ChatRoom)
  roomId: ChatRoom;

  @BelongsTo(() => ChatRoom)
  room: ChatRoom;
}
