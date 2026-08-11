import { Injectable, Inject } from '@nestjs/common';
import {
  IDENTITY_REPOSITORY,
  type IdentityRepositoryPort,
} from '../ports/identity.repository.port.js';
import type { User } from '../../domain/entities/user.entity.js';

@Injectable()
export class PolicyEvaluator {
  constructor(
    @Inject(IDENTITY_REPOSITORY)
    private readonly repo: IdentityRepositoryPort,
  ) {}

  async evaluatePolicies(
    user: User,
    resourceAttributes: Record<string, string>,
  ): Promise<boolean> {
    const policies = await this.repo.findAllPolicies();
    if (policies.length === 0) {
      return true; // No policies active implies default open authorization in simple setups
    }

    const claimsMap: Record<string, string> = {
      userId: user.id,
      tenantId: user.tenantId ?? '',
    };
    for (const c of user.claims) {
      claimsMap[c.name] = c.value;
    }

    for (const policy of policies) {
      if (policy.tenantId && policy.tenantId !== user.tenantId) {
        continue;
      }
      const isAllowed = policy.evaluate({ userClaims: claimsMap, resourceAttributes });
      if (!isAllowed) {
        return false; // Deny always takes precedence
      }
    }

    return true;
  }
}
