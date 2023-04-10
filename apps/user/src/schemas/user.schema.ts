import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;
export type FriendDocument = HydratedDocument<FriendRequests>;

@Schema({ timestamps: true })
export class FriendRequests {
  @Prop({
    type: {
      _id: String,
      username: String,
    },
  })
  requester: {
    _id: string;
    username: string;
  };

  @Prop({
    type: {
      _id: String,
      username: String,
    },
  })
  receiver: {
    _id: string;
    username: string;
  };

  @Prop({ type: Boolean, default: false })
  established: boolean;

  _id?: ObjectId;
}

@Schema()
export class User {
  _id?: ObjectId;

  @Prop({ unique: true })
  email: string;

  @Prop({ select: false })
  password?: string;

  @Prop({ unique: true })
  username: string;

  @Prop({
    required: false,
    index: {
      unique: true,
      partialFilterExpression: { githubId: { $type: 'string' } },
    },
    default: null,
  })
  githubId?: string;

  @Prop()
  photos: { value: string }[];

  @Prop()
  chatSpaces: string[];

  @Prop()
  personalSpace: string;

  @Prop({ required: false, default: [], type: Array })
  friendRequests: FriendRequests[];
}

export const UserSchema = SchemaFactory.createForClass(User);
export const FriendSchema = SchemaFactory.createForClass(FriendRequests);
