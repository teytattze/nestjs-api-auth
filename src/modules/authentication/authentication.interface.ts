import { User, UserRole } from '@prisma/client';

export interface ILoginResponse {
  accessToken: string;
  user: Omit<User, 'password'>;
}

export interface IRegisterResponse {
  accessToken: string;
  user: Omit<User, 'password'>;
}

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface IRegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: UserRole;
}
