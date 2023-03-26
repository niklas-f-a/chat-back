import { SignupDto } from '@app/shared-lib/dto';
import { UsersRepository } from 'apps/user/src/repositories';
import { Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { IUser } from '@app/shared-lib/interfaces';

@Injectable()
export class UserService {
  constructor(
    @Inject(UsersRepository.name)
    private readonly userRepository: UsersRepository,
  ) {}

  async create(credentials: SignupDto) {
    const userExist = await this.findOneByEmail(credentials.email);
    if (userExist) throw new RpcException('email already exist');

    const newUser = (await this.userRepository.create(credentials)).toObject();

    delete newUser.password;
    return newUser;
  }

  async findByGithubId(githubId: string | undefined) {
    return await this.userRepository.findOne({
      githubId,
    });
  }

  async findByGithubIdOrCreate(user: IUser) {
    const foundUser = await this.findByGithubId(user.githubId);
    if (foundUser) return foundUser;

    return await this.userRepository.create(user);
  }

  async findById(userId: string) {
    if (!userId) throw new RpcException('No user id provided');

    return await this.userRepository.findById(userId);
  }

  async findOneByEmail(email: string, select?: string) {
    return await this.userRepository.findOne({ email }, select);
  }

  async addChatSpace(userId: string, chatSpaceId: string) {
    const user = await this.userRepository.findById(userId);
    user?.chatSpaces.push(chatSpaceId);
    return user?.save();
  }

  async deleteChatSpace({
    chatSpaceId,
    userId,
  }: {
    chatSpaceId: string;
    userId: string;
  }) {
    const user = await this.findById(userId);
    if (!user) throw new RpcException('User not found');

    user.chatSpaces = user?.chatSpaces.filter((id) => id !== chatSpaceId);
    return user.save();
  }
}
