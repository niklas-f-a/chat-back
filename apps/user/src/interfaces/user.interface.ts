import { UserDocument } from 'apps/user/src/schemas';
import { IBaseRepository } from '../repositories/base';

export type UserRepositoryInterface = IBaseRepository<UserDocument>;
