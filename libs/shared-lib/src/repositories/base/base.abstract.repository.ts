import { IBaseRepository } from '.';
import { Model } from 'mongoose';

export abstract class BaseRepository<T> implements IBaseRepository<T> {
  private entity: Model<T>;
  protected constructor(entity: Model<T>) {
    this.entity = entity;
  }

  public async create(data: Partial<T>) {
    return await this.entity.create(data);
  }
}
