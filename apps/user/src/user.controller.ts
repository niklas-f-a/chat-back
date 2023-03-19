import { ServiceTokens, SharedService } from '@app/shared-lib';
import { SignupDto } from '@app/shared-lib/dto';
import { Controller, Inject } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { User } from './schemas';
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
    @Payload() user: User,
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
}
