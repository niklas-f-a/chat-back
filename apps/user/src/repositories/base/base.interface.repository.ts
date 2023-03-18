import { FilterQuery } from 'mongoose';

export interface IBaseRepository<T> {
  create(data: Partial<T>): Promise<T>;
  findOne(condition: FilterQuery<T>): Promise<T | null>;
}
