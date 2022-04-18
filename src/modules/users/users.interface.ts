import { UserRole } from '@prisma/client';

export interface ICreateUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: UserRole;
}
