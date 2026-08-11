import { AuthController } from './auth.controller.js';
import type { RegisterUserUseCase } from '../../../application/register-user/register-user.use-case.js';
import type { LoginUseCase } from '../../../application/login/login.use-case.js';
import type { LogoutUseCase } from '../../../application/logout/logout.use-case.js';
import type { RefreshTokenUseCase } from '../../../application/refresh-token/refresh-token.use-case.js';
import type { ManageUserLifecycleUseCase } from '../../../application/manage-user-lifecycle/manage-user-lifecycle.use-case.js';
import { User } from '../../../domain/entities/user.entity.js';
import { PasswordHash } from '../../../domain/value-objects/password-hash.value-object.js';
import type { Request } from 'express';

describe('AuthController', () => {
  let controller: AuthController;
  let sampleUser: User;

  beforeEach(() => {
    sampleUser = User.create({
      code: 'USR-000001',
      email: 'test@tecnojack.com',
      passwordHash: PasswordHash.create('password123'),
    });

    const registerUseCase = { execute: jest.fn().mockResolvedValue(sampleUser) } as unknown as RegisterUserUseCase;
    const loginUseCase = { execute: jest.fn().mockResolvedValue({ accessToken: 'access', refreshToken: 'refresh', expiresInSeconds: 900 }) } as unknown as LoginUseCase;
    const logoutUseCase = { execute: jest.fn().mockResolvedValue(undefined) } as unknown as LogoutUseCase;
    const refreshUseCase = { execute: jest.fn().mockResolvedValue({ accessToken: 'new-access', refreshToken: 'new-refresh', expiresInSeconds: 900 }) } as unknown as RefreshTokenUseCase;
    const lifecycleUseCase = {
      verifyEmail: jest.fn().mockResolvedValue(sampleUser),
      resetPassword: jest.fn().mockResolvedValue(sampleUser),
    } as unknown as ManageUserLifecycleUseCase;

    controller = new AuthController(
      registerUseCase,
      loginUseCase,
      logoutUseCase,
      refreshUseCase,
      lifecycleUseCase,
    );
  });

  it('should register a new user controller endpoint', async () => {
    const res = await controller.register({
      email: 'test@tecnojack.com',
      password: 'password123',
    });

    expect(res.code).toBe('USR-000001');
    expect(res.email).toBe('test@tecnojack.com');
  });

  it('should login user and return tokens', async () => {
    const mockRequest = { ip: '127.0.0.1', headers: {} } as unknown as Request;
    const res = await controller.login({ email: 'test@tecnojack.com', password: 'password123' }, mockRequest);

    expect(res.accessToken).toBe('access');
  });
});
