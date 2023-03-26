import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  _id?: ObjectId;

  @Prop({ unique: true })
  email: string;

  @Prop({ select: false })
  password?: string;

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
}

export const UserSchema = SchemaFactory.createForClass(User);
