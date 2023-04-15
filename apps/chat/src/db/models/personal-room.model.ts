import {
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { ChatRoom } from './chat-room.model';
import { PersonalSpace } from './personal-space.model';

@Table
export class PersonalRoom extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ForeignKey(() => PersonalSpace)
  @Column
  personalSpaceId: string;

  @ForeignKey(() => ChatRoom)
  @Column
  chatRoomId: string;

  @Column
  user1: string;

  @Column
  user2: string;
}
