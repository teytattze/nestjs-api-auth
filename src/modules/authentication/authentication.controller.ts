import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { User as IUser } from '@prisma/client';
import config from 'config';
import { Response, Request } from 'express';
import { AuthenticationService } from './authentication.service';
import { RegisterBody } from './dtos/register.dto';
import {
  ACCESS_TOKEN_COOKIE_NAME,
  USER_COOKIE_NAME,
} from './authentication.const';
import { UserDto } from '../users/dtos/user.dto';
import { User } from '../../common/decorators/user.decorator';
import { LocalAuthGuard } from '../../common/guards/local.guard';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import 'dotenv/config';

@Controller('authentication')
export class AuthenticationController {
  private accessTokenTTL: number;

  constructor(private readonly authenticationService: AuthenticationService) {
    this.accessTokenTTL = config.get<number>('jwt.ttl');
  }

  @Post('register')
  async register(
    @Body() body: RegisterBody,
    @Res({ passthrough: true }) response: Response,
  ): Promise<UserDto> {
    const { user, accessToken } = await this.authenticationService.register(
      body,
    );
    response.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
      maxAge: this.accessTokenTTL * 1000,
      httpOnly: true,
    });
    response.cookie(USER_COOKIE_NAME, user, {
      maxAge: this.accessTokenTTL * 1000,
    });
    return user;
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @User() user: IUser,
    @Res({ passthrough: true }) response: Response,
  ): Promise<UserDto> {
    const { accessToken } = await this.authenticationService.login(user);
    response.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
      maxAge: this.accessTokenTTL * 1000,
      httpOnly: true,
    });
    response.cookie(USER_COOKIE_NAME, user, {
      maxAge: this.accessTokenTTL * 1000,
    });
    return user;
  }

  @Post('logout')
  async logout(
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ message: string }> {
    response.clearCookie(ACCESS_TOKEN_COOKIE_NAME, { maxAge: 0 });
    response.clearCookie(USER_COOKIE_NAME, { maxAge: 0 });
    return { message: 'Logout successful' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('validate/jwt')
  async jwtValidate(
    @User() user: IUser,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<UserDto> {
    const cookieUser = request.cookies[USER_COOKIE_NAME];
    const isValid = this.authenticationService.validateJwt(user, cookieUser);
    if (!isValid) {
      response.clearCookie(ACCESS_TOKEN_COOKIE_NAME, { maxAge: 0 });
      response.clearCookie(USER_COOKIE_NAME, { maxAge: 0 });
      throw new UnauthorizedException();
    }
    return user;
  }
}
