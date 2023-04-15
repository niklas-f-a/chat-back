import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { ChatRoom } from '.';

@Table
export class Message extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

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
