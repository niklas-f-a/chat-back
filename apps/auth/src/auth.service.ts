import { IUser } from '@app/shared-lib/interfaces';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  async encryptPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  async verifyPassword(password: string, hashPass: string) {
    return await bcrypt.compare(password, hashPass);
  }

  async login(password: string, user: IUser) {
    if (!user || !user.password) throw new RpcException('Invalid credentials.');

    const isMatch = await this.verifyPassword(password, user.password);
    if (!isMatch) throw new RpcException('Invalid credentials.');

    delete user.password;
    return user;
  }
}
