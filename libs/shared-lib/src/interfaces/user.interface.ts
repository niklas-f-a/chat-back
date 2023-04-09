import { UserDocument } from 'apps/user/src/schemas';
import { ObjectId } from 'mongoose';
import { IBaseRepository } from '../../../../apps/user/src/repositories/base';

export type UserRepositoryInterface = IBaseRepository<UserDocument>;

type FriendRequests = {
  requester: {
    _id: string;
    username: string;
  };
  receiver: {
    _id: string;
    username: string;
  };
  established: boolean;
  created: Date;
};
export interface IUser {
  _id?: ObjectId;
  email: string;
  password?: string;
  githubId?: string;
  photos: { value: string }[];
  chatSpaces: string[];
  friendRequests?: FriendRequests[];
}
