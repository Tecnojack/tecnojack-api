import { Module } from '@nestjs/common';
import { IDENTITY_REPOSITORY } from './application/ports/identity.repository.port.js';
import { PrismaIdentityRepository } from './infrastructure/persistence/prisma/repositories/prisma-identity.repository.js';
import { AuthenticationService } from './application/services/authentication.service.js';
import { AuthorizationService } from './application/services/authorization.service.js';
import { RoleResolver } from './application/services/role-resolver.js';
import { PermissionResolver } from './application/services/permission-resolver.js';
import { PolicyEvaluator } from './application/services/policy-evaluator.js';
import { ClaimsResolver } from './application/services/claims-resolver.js';
import { IdentityResolver } from './application/services/identity-resolver.js';
import { RegisterUserUseCase } from './application/register-user/register-user.use-case.js';
import { LoginUseCase } from './application/login/login.use-case.js';
import { LogoutUseCase } from './application/logout/logout.use-case.js';
import { RefreshTokenUseCase } from './application/refresh-token/refresh-token.use-case.js';
import { ManageRolesUseCase } from './application/manage-roles/manage-roles.use-case.js';
import { ManagePermissionsUseCase } from './application/manage-permissions/manage-permissions.use-case.js';
import { ManagePoliciesUseCase } from './application/manage-policies/manage-policies.use-case.js';
import { ManageAPIKeysUseCase } from './application/manage-api-keys/manage-api-keys.use-case.js';
import { ManageSessionsUseCase } from './application/manage-sessions/manage-sessions.use-case.js';
import { ManageUserLifecycleUseCase } from './application/manage-user-lifecycle/manage-user-lifecycle.use-case.js';
import { AuthController } from './presentation/http/controllers/auth.controller.js';
import { AccessController } from './presentation/http/controllers/access.controller.js';
import { IdentityFacade } from './public/identity.facade.js';

@Module({
  controllers: [AuthController, AccessController],
  providers: [
    {
      provide: IDENTITY_REPOSITORY,
      useClass: PrismaIdentityRepository,
    },
    AuthenticationService,
    AuthorizationService,
    RoleResolver,
    PermissionResolver,
    PolicyEvaluator,
    ClaimsResolver,
    IdentityResolver,
    RegisterUserUseCase,
    LoginUseCase,
    LogoutUseCase,
    RefreshTokenUseCase,
    ManageRolesUseCase,
    ManagePermissionsUseCase,
    ManagePoliciesUseCase,
    ManageAPIKeysUseCase,
    ManageSessionsUseCase,
    ManageUserLifecycleUseCase,
    IdentityFacade,
  ],
  exports: [IdentityFacade, IDENTITY_REPOSITORY, AuthenticationService, IdentityResolver, AuthorizationService],
})
export class IdentityModule {}
