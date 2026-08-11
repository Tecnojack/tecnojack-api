import { User } from './user.entity.js';
import { PasswordHash } from '../value-objects/password-hash.value-object.js';
import { Claim } from '../value-objects/claim.value-object.js';
import { Policy, type PolicyRule } from './policy.entity.js';
import { UserStatus, PolicyEffect } from '../enums/identity.enums.js';

describe('IAM Entities & Value Objects', () => {
  it('should hash and verify passwords correctly', () => {
    const pass = PasswordHash.create('mypassword123');
    expect(pass.verify('mypassword123')).toBe(true);
    expect(pass.verify('wrong')).toBe(false);
  });

  it('should manage User roles and claims', () => {
    const pass = PasswordHash.create('mypassword123');
    const user = User.create({
      code: 'USR-000001',
      email: 'test@tecnojack.com',
      passwordHash: pass,
    });

    expect(user.status).toBe(UserStatus.UNVERIFIED);
    user.verifyEmail();
    expect(user.status).toBe(UserStatus.ACTIVE);

    user.assignRole('rol-1');
    expect(user.roleIds).toContain('rol-1');

    user.setClaims([new Claim({ name: 'studioId', value: '99' })]);
    expect(user.claims.find((c) => c.name === 'studioId')?.value).toBe('99');
  });

  it('should evaluate dynamic ABAC policies', () => {
    const rule: PolicyRule = {
      effect: PolicyEffect.ALLOW,
      resourcePattern: 'galleries:*',
      actionPattern: 'write',
      conditions: [
        {
          field: 'studioId',
          operator: 'EQUALS',
          value: 'resource.studioId',
        },
      ],
    };

    const policy = new Policy({
      code: 'POL-000001',
      name: 'Owner Only',
      rules: [rule],
    });

    const userContext = { studioId: '99' };
    const validResource = { studioId: '99' };
    const invalidResource = { studioId: '100' };

    expect(policy.evaluate({ userClaims: userContext, resourceAttributes: validResource })).toBe(true);
    expect(policy.evaluate({ userClaims: userContext, resourceAttributes: invalidResource })).toBe(false);
  });
});
