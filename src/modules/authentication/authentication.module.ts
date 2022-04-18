import { Module, UnauthorizedException } from '@nestjs/common';
import { JwtModule, JwtSecretRequestType } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import config from 'config';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { readFileSync } from 'fs';
import { join } from 'path';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';
import 'dotenv/config';

@Module({
  imports: [
    JwtModule.register({
      signOptions: {
        algorithm: config.get('jwt.alg'),
        expiresIn: config.get('jwt.ttl'),
        issuer: config.get('jwt.iss'),
      },
      secretOrKeyProvider: (requestType: JwtSecretRequestType) => {
        switch (requestType) {
          case JwtSecretRequestType.SIGN:
            return readFileSync(
              join(process.cwd(), config.get('jwt.privateKeyPath')),
            );
          case JwtSecretRequestType.VERIFY:
            return readFileSync(
              join(process.cwd(), config.get('jwt.publicKeyPath')),
            );
          default:
            throw new UnauthorizedException();
        }
      },
    }),
    PassportModule,
    UsersModule,
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, LocalStrategy, JwtStrategy],
})
export class AuthenticationModule {}
