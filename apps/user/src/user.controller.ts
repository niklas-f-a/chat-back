import { ServiceTokens, SharedService } from '@app/shared-lib';
import { SignupDto } from '@app/shared-lib/dto';
import { IUser } from '@app/shared-lib/interfaces';
import { Controller, Inject } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(
    private readonly sharedService: SharedService,
    @Inject(ServiceTokens.USER) private readonly userService: UserService,
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

  @MessagePattern({ cmd: 'find-or-create-github-user' })
  async findByGithubIdOrCreate(
    @Ctx() context: RmqContext,
    @Payload() user: IUser,
  ) {
    this.sharedService.rabbitAck(context);

    return await this.userService.findByGithubIdOrCreate(user);
  }

  @MessagePattern({ cmd: 'signup' })
  signup(@Ctx() context: RmqContext, @Payload() signUpDto: SignupDto) {
    this.sharedService.rabbitAck(context);

    return this.userService.create(signUpDto);
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
