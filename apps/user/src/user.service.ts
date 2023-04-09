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

  async addFriend({
    requester,
    receiver,
  }: {
    requester: string;
    receiver: string;
  }) {
    const receivingUser = await this.findById(receiver);
    const requestingUser = await this.findById(requester);

    if (!receivingUser || !requestingUser)
      throw new RpcException('Something went wrong');

    const friendRequest = {
      receiver,
      requester,
      established: false,
    };
    console.log(requestingUser);
    console.log(receivingUser);

    requestingUser?.friendRequests?.push(friendRequest);
    receivingUser?.friendRequests?.push(friendRequest);

    console.log(requestingUser);
    console.log(receivingUser);
    await requestingUser?.save();
    await receivingUser?.save();
    console.log(requestingUser);
    console.log(receivingUser);

    return requestingUser;
  }

  async create(credentials: SignupDto) {
    const userExist = await this.findOneByEmail(credentials.email);
    if (userExist) throw new RpcException('email already exist');
    const splittedEmail = credentials.email.split('@')[0];

    const usersWithName = await this.userRepository.find({
      username: { $regex: '.*' + splittedEmail + '.*' },
    });

    const newUserName =
      splittedEmail +
      (usersWithName.length > 0 ? `${usersWithName.length + 1}` : '');

    const newUser = (
      await this.userRepository.create({
        ...credentials,
        username: newUserName,
      })
    ).toObject();

    delete newUser.password;
    return newUser;
  }

  async searchForUser(term: string, skip = 0) {
    return this.userRepository.find(
      {
        $or: [
          { email: { $regex: '.*' + term + '.*' } },
          { username: { $regex: '.*' + term + '.*' } },
        ],
      },
      {
        limit: 10,
        skip,
        select: 'username',
      },
    );
  }

  async joinRoom({
    userId,
    chatSpaceId,
  }: {
    userId: string;
    chatSpaceId: string;
  }) {
    const user = await this.userRepository.findById(userId);
    const spaceExist = user?.chatSpaces.find(
      (spaceId) => spaceId === chatSpaceId,
    );
    if (spaceExist) return user;

    user?.chatSpaces.push(chatSpaceId);
    return user?.save();
  }

  async findByGithubId(githubId?: string) {
    return await this.userRepository.findOne({
      githubId,
    });
  }

  async findByGithubIdOrCreate(user: IUser) {
    const foundUser = await this.findByGithubId(user.githubId);
    if (foundUser) return foundUser;
    console.log(user);

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
