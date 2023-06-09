import { Model, FilterQuery, QueryOptions } from 'mongoose';
export abstract class BaseRepository<T> {
  private entity: Model<T>;
  protected constructor(entity: Model<T>) {
    this.entity = entity;
  }

  public async create(data: Partial<T>) {
    return await this.entity.create(data);
  }

  public async findOne(condition: FilterQuery<T>, select = '-password') {
    return await this.entity.findOne(condition).select(select).exec();
  }

  public async findById(id: string, options?: QueryOptions<T>) {
    return await this.entity.findById(id).select(options?.select).exec();
  }

  public async find(filter: FilterQuery<T>, options?: QueryOptions<T>) {
    return await this.entity
      .find(filter)
      .limit(options?.limit ?? 10)
      .skip(options?.skip ?? 0)
      .select(options?.select)
      .exec();
  }
}
