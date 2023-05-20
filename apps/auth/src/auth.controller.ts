import { ClientTokens, ServiceTokens, SharedService } from '@app/shared-lib';
import { LoginDto, SignupDto } from '@app/shared-lib/dto';
import { Controller, Inject } from '@nestjs/common';
import {
  ClientProxy,
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { switchMap } from 'rxjs';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(
    private readonly sharedService: SharedService,
    @Inject(ServiceTokens.AUTH) private readonly authService: AuthService,
    @Inject(ClientTokens.USER) private readonly userClient: ClientProxy,
  ) {}

  @MessagePattern({ cmd: 'signup' })
  async signup(@Ctx() context: RmqContext, @Payload() signupDto: SignupDto) {
    this.sharedService.rabbitAck(context);

    const userWithHashpass = {
      ...signupDto,
      password: await this.authService.encryptPassword(signupDto.password),
    };

    return this.userClient.send({ cmd: 'signup' }, userWithHashpass);
  }

  @MessagePattern({ cmd: 'login' })
  login(@Payload() loginDto: LoginDto, @Ctx() context: RmqContext) {
    this.sharedService.rabbitAck(context);

    const { password, email } = loginDto;
    const selectOptions = {
      email,
      select: '+password',
    };

    return this.userClient
      .send({ cmd: 'find-by-email' }, selectOptions)
      .pipe(switchMap((value) => this.authService.login(password, value)));
  }

  @MessagePattern({ cmd: 'verify-session' })
  verifySession(@Ctx() context: RmqContext, @Payload() userId: string) {
    this.sharedService.rabbitAck(context);
    return this.userClient.send({ cmd: 'find-by-id' }, userId);
    // .pipe(switchMap((value) => this.authService.verifySession(value)));
  }
}
