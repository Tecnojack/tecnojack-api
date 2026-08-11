import { SetMetadata, type CustomDecorator } from '@nestjs/common';

export interface RequiredPermission {
  resource: string;
  action: string;
}

export const REQUIRE_PERMISSIONS_KEY = 'require_permissions';
export const RequirePermissions = (resource: string, action: string): CustomDecorator<string> =>
  SetMetadata(REQUIRE_PERMISSIONS_KEY, { resource, action });
