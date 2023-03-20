import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { User } from 'apps/user/src/schemas';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();

    return req.isAuthenticated() || this.isLoggedIn(req.session?.user);
  }

  isLoggedIn(user: User | null) {
    return !!user;
  }
}
