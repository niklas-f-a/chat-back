import { SignupDto } from '@app/shared-lib/dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  async create(cred: SignupDto) {
    console.log(cred);
    try {
      // return await new this.userModel({
      //   ...details,
      //   password: (details.password = await bcrypt.hash(details.password, 10)),
      // }).save();
    } catch (error) {
      if (error.code === 11000) {
        // rmq or tcp error
        // return new ConflictException('User with email already exist');
      }
      return error;
    }
  }
}
