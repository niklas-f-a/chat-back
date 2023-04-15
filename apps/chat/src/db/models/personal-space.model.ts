import {
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  Unique,
  UpdatedAt,
} from 'sequelize-typescript';
import { ChatSpace } from './chat-space.model';
import { ChatRoom } from './chat-room.model';
import { PersonalRoom } from '.';

@Table
export class PersonalSpace extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column
  userId: string;

  // default to asset
  @Column
  img: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updateAt: Date;

  @BelongsToMany(() => ChatRoom, () => PersonalRoom)
  chatRooms: Array<ChatRoom & { PersonalRoom: PersonalRoom }>;
}
