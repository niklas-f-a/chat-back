import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { User } from 'apps/user/src/schemas';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  async encryptPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  async verifyPassword(password: string, hashPass: string) {
    return await bcrypt.compare(password, hashPass);
  }

  async login(password: string, user: User) {
    if (!user || !user.password) throw new RpcException('Invalid credentials.');

    const isMatch = await this.verifyPassword(password, user.password);
    if (!isMatch) throw new RpcException('Invalid credentials.');

    delete user.password;
    return user;
  }

  // async verifySession(userId: string) {
  //   if (!userId) throw new RpcException('Forbidden.');

  // }
}
