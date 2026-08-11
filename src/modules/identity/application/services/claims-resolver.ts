import { Injectable } from '@nestjs/common';
import type { User } from '../../domain/entities/user.entity.js';


@Injectable()
export class ClaimsResolver {
  resolveClaims(user: User): Record<string, string> {
    const map: Record<string, string> = {
      sub: user.id,
      email: user.email,
      code: user.code,
      tenantId: user.tenantId ?? '',
    };
    for (const c of user.claims) {
      map[c.name] = c.value;
    }
    return map;
  }
}
