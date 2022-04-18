import { createParamDecorator } from '@nestjs/common';
import { User as IUser } from '@prisma/client';
import httpContext from 'express-http-context';

export const User = createParamDecorator(
  (data: keyof Omit<IUser, 'password'>) => {
    const user = httpContext.get('user');
    return data ? user[data] : user;
  },
);
