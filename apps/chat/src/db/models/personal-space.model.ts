import {
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
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
