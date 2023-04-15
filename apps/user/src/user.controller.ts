import { ClientTokens, ServiceTokens, SharedService } from '@app/shared-lib';
import { SignupDto } from '@app/shared-lib/dto';
import { IUser } from '@app/shared-lib/interfaces';
import { Controller, Inject } from '@nestjs/common';
import {
  ClientProxy,
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { UserService } from './user.service';
import { User } from './schemas';
import { map, switchMap, tap } from 'rxjs';

@Controller()
export class UserController {
  constructor(
    private readonly sharedService: SharedService,
    @Inject(ServiceTokens.USER) private readonly userService: UserService,
    @Inject(ClientTokens.CHAT) private readonly chatClient: ClientProxy,
  ) {}

  @MessagePattern({ cmd: 'find-by-id' })
  findById(@Ctx() context: RmqContext, @Payload() userId: string) {
    this.sharedService.rabbitAck(context);

    return this.userService.findById(userId);
  }

  @MessagePattern({ cmd: 'find-by-github-id' })
  findByGithubId(@Ctx() context: RmqContext, @Payload() userId: string) {
    this.sharedService.rabbitAck(context);

    return this.userService.findByGithubId(userId);
  }

  @MessagePattern({ cmd: 'search-for-user' })
  searchForUser(
    @Ctx() context: RmqContext,
    @Payload() { skip, users }: { skip: number; users: string },
  ) {
    this.sharedService.rabbitAck(context);

    return this.userService.searchForUser(users, skip);
  }

  @MessagePattern({ cmd: 'get-friends' })
  getFriends(@Ctx() context: RmqContext, @Payload('userId') userId: string) {
    this.sharedService.rabbitAck(context);

    return this.userService.getFriends(userId);
  }

  @MessagePattern({ cmd: 'join-room' })
  joinRoom(
    @Ctx() context: RmqContext,
    @Payload() payload: { userId: string; chatSpaceId: string },
  ) {
    this.sharedService.rabbitAck(context);

    return this.userService.joinRoom(payload);
  }

  @MessagePattern({ cmd: 'accept-request' })
  async acceptFriendRequest(
    @Ctx() context: RmqContext,
    @Payload('requestId') requestId: string,
  ) {
    this.sharedService.rabbitAck(context);

    const { updatedRequest, receivingUser, requestingUser } =
      await this.userService.acceptFriendRequest(requestId);

    return this.chatClient
      .send({ cmd: 'create-personal-room' }, { receivingUser, requestingUser })
      .pipe(map(() => updatedRequest));
  }

  @MessagePattern({ cmd: 'add-friend' })
  addFriend(
    @Ctx() context: RmqContext,
    @Payload() payload: { requester: string; receiver: string },
  ) {
    this.sharedService.rabbitAck(context);

    return this.userService.addFriend(payload);
  }

  @MessagePattern({ cmd: 'find-or-create-github-user' })
  async findByGithubIdOrCreate(
    @Ctx() context: RmqContext,
    @Payload() user: User,
  ) {
    this.sharedService.rabbitAck(context);

    const res = await this.userService.findByGithubIdOrCreate(user);
    if (res.created) {
      return this.chatClient
        .send({ cmd: 'create-personal-space' }, { userId: res.user._id })
        .pipe(
          switchMap((value) =>
            this.userService.addPersonalChatSpace(
              res.user._id.toString(),
              value.id,
            ),
          ),
          switchMap(() => this.userService.findById(res?.user._id?.toString())),
        );
    }

    return res.user;
  }

  @MessagePattern({ cmd: 'signup' })
  async signup(@Ctx() context: RmqContext, @Payload() signUpDto: SignupDto) {
    this.sharedService.rabbitAck(context);

    const user = await this.userService.create(signUpDto);

    return this.chatClient
      .send({ cmd: 'create-personal-space' }, { userId: user._id })
      .pipe(
        switchMap((value) => {
          console.log(value);
          return this.userService.addPersonalChatSpace(
            user._id.toString(),
            value.id,
          );
        }),
        switchMap(() => this.userService.findById(user._id.toString())),
      );
  }

  @MessagePattern({ cmd: 'find-by-email' })
  async findByEmail(
    @Ctx() context: RmqContext,
    @Payload() payload: { email: string; select: string },
  ) {
    this.sharedService.rabbitAck(context);

    const { email, select } = payload;
    return await this.userService.findOneByEmail(email, select);
  }

  @MessagePattern({ cmd: 'add-chat-space' })
  addChatSpace(
    @Ctx() context: RmqContext,
    @Payload() payload: { chatSpaceId: string; userId: string },
  ) {
    this.sharedService.rabbitAck(context);
    const { chatSpaceId, userId } = payload;
    return this.userService.addChatSpace(userId, chatSpaceId);
  }

  @MessagePattern({ cmd: 'delete-chat-space' })
  deleteChatSpace(
    @Ctx() context: RmqContext,
    @Payload() payload: { chatSpaceId: string; userId: string },
  ) {
    this.sharedService.rabbitAck(context);

    return this.userService.deleteChatSpace(payload);
  }
}
