import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { ChatSpace, Message } from '.';

@Table
export class ChatRoom extends Model {
  @Column({
    type: DataType.TEXT,
    defaultValue: 'Generall',
  })
  name: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updateAt: Date;

  @HasMany(() => Message)
  messages: Message[];

  @BelongsTo(() => ChatSpace)
  chatSpace: ChatSpace;

  @ForeignKey(() => ChatSpace)
  chatSpaceId: string;
}
