import { UserDocument } from 'apps/user/src/schemas';
import { IBaseRepository } from '../../../../apps/user/src/repositories/base';

export type UserRepositoryInterface = IBaseRepository<UserDocument>;
