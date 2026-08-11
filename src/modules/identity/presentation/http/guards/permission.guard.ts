import { Injectable, type CanActivate, type ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthorizationService } from '../../../application/services/authorization.service.js';
import { REQUIRE_PERMISSIONS_KEY, type RequiredPermission } from '../decorators/require-permissions.decorator.js';
import type { User } from '../../../domain/entities/user.entity.js';

interface RequestWithUser {
  user?: User;
  params: Record<string, string>;
  query: Record<string, string>;
}

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authzService: AuthorizationService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required = this.reflector.getAllAndOverride<RequiredPermission>(
      REQUIRE_PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!required) {
      return true; // No permission restrictions set on route
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;
    if (!user) {
      throw new ForbiddenException('Access denied. Identity is not authenticated.');
    }

    // Capture simple dynamic route parameters (e.g. ownerId) to feed attributes
    const resourceAttributes: Record<string, string> = {
      ...request.params,
      ...request.query,
    };

    const isAuthorized = await this.authzService.isAuthorized(
      user,
      required.resource,
      required.action,
      resourceAttributes,
    );

    if (!isAuthorized) {
      throw new ForbiddenException('Access denied. Insufficient permissions or policy violation.');
    }

    return true;
  }
}
