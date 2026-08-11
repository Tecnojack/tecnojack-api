import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';

@Injectable()
export class AuthenticationService {
  private readonly secretKey = 'TECN0JACK-SUPER-SECRET-KEY';

  signToken(payload: Record<string, unknown>, expiresInSeconds = 900): string {
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
    const body = Buffer.from(JSON.stringify({ ...payload, exp })).toString('base64url');

    const signature = createHash('sha256').update(`${header}.${body}.${this.secretKey}`).digest('base64url');
    return `${header}.${body}.${signature}`;
  }

  verifyToken(token: string): Record<string, unknown> | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const [header, body, signature] = parts;
      const computedSignature = createHash('sha256').update(`${header}.${body}.${this.secretKey}`).digest('base64url');

      if (signature !== computedSignature) return null;

      const payload = JSON.parse(Buffer.from(body!, 'base64url').toString('utf8')) as Record<string, unknown>;
      const exp = payload.exp;
      if (typeof exp === 'number' && exp < Math.floor(Date.now() / 1000)) {
        return null; // Expired
      }
      return payload;
    } catch {
      return null;
    }
  }
}
