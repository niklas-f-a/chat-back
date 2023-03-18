// import { IBaseRepository } from '.';
import { Model, FilterQuery } from 'mongoose';
// implements IBaseRepository<T>
export abstract class BaseRepository<T> {
  private entity: Model<T>;
  protected constructor(entity: Model<T>) {
    this.entity = entity;
  }

  public async create(data: Partial<T>) {
    return await new this.entity(data).save();
  }

  public async findOne(condition: FilterQuery<T>) {
    return await this.entity.findOne(condition).exec();
  }

  public async findById(id: string) {
    return await this.entity.findById(id);
  }
}
