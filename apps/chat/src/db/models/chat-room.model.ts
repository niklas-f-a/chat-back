import {
  Column,
  CreatedAt,
  ForeignKey,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Message } from '.';

@Table
export class ChatRoom extends Model {
  @Column
  createdBy: string;

  @Column
  name: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updateAt: Date;

  @HasMany(() => Message)
  messages: Message[];

  @ForeignKey(() => Message)
  messageId: number;
}
