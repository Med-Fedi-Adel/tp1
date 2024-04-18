import {
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { PayloadType } from './types';

@Injectable()
export class AdminGuard extends AuthGuard('jwt') {
  constructor(@Inject('REQUEST') private readonly request: Request) {
    super();
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  handleRequest<TUser = PayloadType>(err: any, user: any): TUser {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    if (user.role !== 'admin') {
      throw new UnauthorizedException();
    }
    return user;
  }
}
