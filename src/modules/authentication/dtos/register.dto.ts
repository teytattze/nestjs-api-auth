import { UserRole } from '@prisma/client';
import { IsEmail, IsEnum, IsString } from 'class-validator';

export class RegisterBody {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsEnum(UserRole)
  role?: UserRole;
}
