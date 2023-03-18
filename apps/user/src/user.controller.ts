import { ServiceTokens, SharedService } from '@app/shared-lib';
import { SignupDto } from '@app/shared-lib/dto';
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

  @MessagePattern({ cmd: 'sign-up' })
  signup(@Ctx() context: RmqContext, @Payload() signUpDto: SignupDto) {
    this.sharedService.rabbitAck(context);

    return this.userService.create(signUpDto);
  }
}
