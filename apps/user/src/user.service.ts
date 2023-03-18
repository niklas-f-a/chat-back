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
      const userExist = await this.findOne(cred.email);
      if (userExist) throw new RpcException('email already exist');

      const newUser = (await this.userRepository.create(cred)).toObject();
      delete newUser.password;
      return newUser;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  async findOne(email: string) {
    try {
      return await this.userRepository.findOne({ email });
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
