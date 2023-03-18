import { SignupDto } from '@app/shared-lib/dto';
import { UsersRepository } from 'apps/user/src/repositories';
import { Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UserService {
  constructor(
    @Inject(UsersRepository.name)
    private readonly userRepository: UsersRepository,
  ) {}

  async create(cred: SignupDto) {
    try {
      return await this.userRepository.create(cred);
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
