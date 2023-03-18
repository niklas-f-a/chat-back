import { ServiceTokens } from '@app/shared-lib';
import { Controller, Get, Inject } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(
    @Inject(ServiceTokens.AUTH) private readonly authService: AuthService,
  ) {}

  @Get()
  getHello(): string {
    return this.authService.getHello();
  }
}
