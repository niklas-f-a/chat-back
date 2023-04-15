import {
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { ChatRoom } from '.';
import { PersonalSpace } from './personal-space.model';

@Table
export class ChatSpace extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  // default to asset
  @Column
  img: string;

  @Column
  createdBy: string;

  @Column
  name: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updateAt: Date;

  @HasMany(() => ChatRoom)
  chatRooms: ChatRoom[];
}
