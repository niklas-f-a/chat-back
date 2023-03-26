import { UserDocument } from 'apps/user/src/schemas';
import { ObjectId } from 'mongoose';
import { IBaseRepository } from '../../../../apps/user/src/repositories/base';

export type UserRepositoryInterface = IBaseRepository<UserDocument>;

export interface IUser {
  _id?: ObjectId;
  email: string;
  password?: string;
  githubId?: string;
  photos: { value: string }[];
  chatSpaces: string[];
}
