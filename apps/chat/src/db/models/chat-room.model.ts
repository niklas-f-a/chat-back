import {
  BelongsTo,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { ChatSpace, Message, PersonalRoom } from '.';
import { PersonalSpace } from './personal-space.model';

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

  @BelongsToMany(() => PersonalSpace, () => PersonalRoom)
  personalRooms: Array<PersonalSpace & { PersonalRoom: PersonalRoom }>;
}
