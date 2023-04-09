import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

type FriendRequests = {
  requester: string;
  receiver: string;
  established: boolean;
};

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

  @Prop({ required: false, default: [], type: Array })
  friendRequests: FriendRequests[];
}

export const UserSchema = SchemaFactory.createForClass(User);
