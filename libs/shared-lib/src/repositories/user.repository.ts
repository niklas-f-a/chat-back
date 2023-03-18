import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'apps/user/src/schemas';
import { Model } from 'mongoose';
import { UserRepositoryInterface } from '../interfaces';
import { BaseRepository } from './base';

@Injectable()
export class UsersRepository
  extends BaseRepository<UserDocument>
  implements UserRepositoryInterface
{
  constructor(
    @InjectModel(User.name)
    private readonly UserRepository: Model<UserDocument>,
  ) {
    super(UserRepository);
  }
}
