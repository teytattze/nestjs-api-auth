import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(ctx: ExecutionContext) {
    return super.canActivate(ctx);
  }
  handleRequest(error, user, info) {
    if (error || info) throw new UnauthorizedException();
    return user;
  }
}
