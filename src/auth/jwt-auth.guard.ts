/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const url: string = request.url;
    const method: string = request.method;

    // ✅ Bypass guard for /auth/login (and optionally method)
    if (url === '/auth/login' && method === 'POST') {
      return true;
    }

    // ✅ Continue with default JWT validation
    return (await super.canActivate(context)) as boolean;
  }
}
