import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import _ from 'lodash';
import { HashingUtils } from '../../lib/hashing';
import { UsersService } from '../users/users.service';
import {
  ILoginPayload,
  ILoginResponse,
  IRegisterPayload,
  IRegisterResponse,
} from './authentication.interface';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async register(data: IRegisterPayload): Promise<IRegisterResponse> {
    const { email, firstName, lastName, password, role } = data;
    const user = await this.usersService.createUser({
      email,
      firstName,
      lastName,
      password,
      role,
    });
    return await this.login(user);
  }

  async login(user: User): Promise<ILoginResponse> {
    const { password, ...userWithoutPassword } = user;
    const payload = {
      sub: user.id,
      user: userWithoutPassword,
    };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken, user: userWithoutPassword };
  }

  async validateAccount({ email, password }: ILoginPayload): Promise<User> {
    const user = await this.usersService.getUserByEmail(email);
    if (!user || !password || !email) return null;
    const isMatched = await HashingUtils.compareHashedPassword(
      password,
      user.password,
    );
    if (user && isMatched) {
      delete user.password;
      return user;
    }
    return null;
  }

  validateJwt(
    jwtUser: Omit<User, 'password'>,
    cookieUser: Omit<User, 'password'>,
  ): boolean {
    return _.isEqual(jwtUser, cookieUser);
  }
}
