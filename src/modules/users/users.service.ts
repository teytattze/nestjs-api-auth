import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import to from 'await-to-js';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { HashingUtils } from 'src/lib/hashing';
import { ICreateUserPayload } from './users.interface';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserByEmail(email: string): Promise<User> {
    const [error, user] = await to<User>(
      this.prisma.user.findUnique({ where: { email } }),
    );
    if (error) throw new NotFoundException();
    return user;
  }

  async createUser(data: ICreateUserPayload): Promise<User> {
    const { email, firstName, lastName, password, role } = data;
    const hashedPassword = await HashingUtils.hashPassword(password);
    const [error, user] = await to<User>(
      this.prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          password: hashedPassword,
          role,
        },
      }),
    );
    if (error) throw new BadRequestException();
    return user;
  }
}
