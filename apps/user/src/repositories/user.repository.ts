import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'apps/user/src/schemas';
import { Model } from 'mongoose';
// import { UserRepositoryInterface } from '../interfaces';
import { BaseRepository } from './base';

@Injectable()
// implements UserRepositoryInterface
export class UsersRepository extends BaseRepository<UserDocument> {
  constructor(
    @InjectModel(User.name)
    private readonly userRepository: Model<UserDocument>,
  ) {
    super(userRepository);
  }
}
