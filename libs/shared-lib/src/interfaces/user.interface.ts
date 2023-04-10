import { UserDocument } from 'apps/user/src/schemas';
import { ObjectId } from 'mongoose';
import { IBaseRepository } from '../../../../apps/user/src/repositories/base';

export type UserRepositoryInterface = IBaseRepository<UserDocument>;

export type FriendRequest = {
  requester: {
    _id: string;
    username: string;
  };
  receiver: {
    _id: string;
    username: string;
  };
  established: boolean;
  _id: string;
};
export interface IUser {
  _id: ObjectId;
  email: string;
  password?: string;
  githubId?: string;
  photos: { value: string }[];
  chatSpaces: string[];
  friendRequests?: FriendRequest[];
  personalChatSpace?: string;
}
