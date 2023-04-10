import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FriendDocument, FriendRequests } from 'apps/user/src/schemas';
import { Model } from 'mongoose';
// import { UserRepositoryInterface } from '../interfaces';
import { BaseRepository } from './base';

@Injectable()
// implements UserRepositoryInterface
export class FriendRequestsRepository extends BaseRepository<FriendDocument> {
  constructor(
    @InjectModel(FriendRequests.name)
    private readonly friendRequestRepository: Model<FriendDocument>,
  ) {
    super(friendRequestRepository);
  }
}
