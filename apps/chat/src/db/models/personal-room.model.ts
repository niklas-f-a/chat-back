import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { ChatRoom } from './chat-room.model';
import { PersonalSpace } from './personal-space.model';

@Table
export class PersonalRoom extends Model {
  @ForeignKey(() => PersonalSpace)
  @Column
  personalSpaceId: string;

  @ForeignKey(() => ChatRoom)
  @Column
  chatRoomId: string;
}
