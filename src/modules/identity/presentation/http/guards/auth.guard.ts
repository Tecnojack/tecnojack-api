import { Injectable, type CanActivate, type ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthenticationService } from '../../../application/services/authentication.service.js';
import { IdentityResolver } from '../../../application/services/identity-resolver.js';

interface RequestWithAuth {
  headers: Record<string, string | undefined>;
  ip?: string;
  user?: unknown;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthenticationService,
    private readonly identityResolver: IdentityResolver,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithAuth>();
    
    // Check Authorization header
    const authHeader = request.headers.authorization;
    if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const payload = this.authService.verifyToken(token);
      if (payload) {
        const user = await this.identityResolver.resolveFromTokenPayload(payload as { sub: string });
        if (user) {
          request.user = user;
          return true;
        }
      }
    }

    // Fallback to API Key header check
    const apiKeyHeader = request.headers['x-api-key'];
    if (typeof apiKeyHeader === 'string') {
      const user = await this.identityResolver.resolveFromApiKey(apiKeyHeader);
      if (user) {
        request.user = user;
        return true;
      }
    }

    throw new UnauthorizedException('Authentication credentials are missing or invalid.');
  }
}
