import { Injectable, Inject } from '@nestjs/common';
import {
  IDENTITY_REPOSITORY,
  type IdentityRepositoryPort,
} from '../ports/identity.repository.port.js';
import { Policy, type PolicyRule } from '../../domain/entities/policy.entity.js';
import { PolicyNotFoundException } from '../../domain/errors/identity.errors.js';

export interface CreatePolicyCommand {
  name: string;
  rules: PolicyRule[];
  tenantId?: string;
  actorId?: string;
}

export interface UpdatePolicyCommand {
  id: string;
  name: string;
  rules: PolicyRule[];
  actorId?: string;
}

@Injectable()
export class ManagePoliciesUseCase {
  constructor(
    @Inject(IDENTITY_REPOSITORY)
    private readonly repo: IdentityRepositoryPort,
  ) {}

  async createPolicy(command: CreatePolicyCommand): Promise<Policy> {
    const code = await this.repo.nextPolicyCode();
    const policy = new Policy({
      code,
      name: command.name,
      rules: command.rules,
      tenantId: command.tenantId,
    });
    return this.repo.savePolicy(policy);
  }

  async updatePolicy(command: UpdatePolicyCommand): Promise<Policy> {
    const policy = await this.repo.findPolicyById(command.id);
    if (!policy) throw new PolicyNotFoundException(command.id);

    policy.updateDetails(command.name, command.rules, command.actorId);
    return this.repo.savePolicy(policy);
  }

  async deletePolicy(id: string, actorId?: string): Promise<Policy> {
    const policy = await this.repo.findPolicyById(id);
    if (!policy) throw new PolicyNotFoundException(id);

    policy.softDelete(actorId);
    return this.repo.savePolicy(policy);
  }

  async evaluate(
    id: string,
    context: { userClaims: Record<string, string>; resourceAttributes: Record<string, string> },
  ): Promise<boolean> {
    const policy = await this.repo.findPolicyById(id);
    if (!policy) throw new PolicyNotFoundException(id);

    return policy.evaluate(context);
  }
}
