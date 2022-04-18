import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from 'jsonwebtoken';
import config from 'config';
import { Request } from 'express';
import httpContext from 'express-http-context';
import { readFileSync } from 'fs';
import { join } from 'path';
import { ACCESS_TOKEN_COOKIE_NAME } from '../authentication.const';
import 'dotenv/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      ignoreExpiration: false,
      secretOrKey: readFileSync(
        join(process.cwd(), config.get('jwt.publicKeyPath')),
      ),
    });
  }

  async validate({ user }: JwtPayload & { user: User }) {
    httpContext.set('user', user);
    return user;
  }
}

const cookieExtractor = (req: Request) => {
  const cookie = req.cookies[ACCESS_TOKEN_COOKIE_NAME];
  return cookie || null;
};
