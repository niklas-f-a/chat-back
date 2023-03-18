import { SignupDto } from '@app/shared-lib/dto';
import { UsersRepository } from 'apps/user/src/repositories';
import { Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { SharedService } from '@app/shared-lib';

@Injectable()
export class UserService {
  constructor(
    @Inject(UsersRepository.name)
    private readonly userRepository: UsersRepository,
    private sharedService: SharedService,
  ) {}

  async create(credentials: SignupDto) {
    try {
      const userExist = await this.findOneByEmail(credentials.email);
      if (userExist) throw new RpcException('email already exist');

      const newUser = (
        await this.userRepository.create(credentials)
      ).toObject();

      delete newUser.password;
      return newUser;
    } catch (error) {
      console.log(error);
      throw new RpcException(error);
    }
  }

  async findOneByEmail(email: string, select?: string) {
    try {
      return await this.userRepository.findOne({ email }, select);
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
