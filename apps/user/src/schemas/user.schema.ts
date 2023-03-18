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

  // @Prop({ unique: true, sparse: true, select: true })
  // githubId: string | null;

  // @Prop()
  // photos: { value: string }[];

  // @Prop()
  // chatRooms: number[];
}

export const UserSchema = SchemaFactory.createForClass(User);
