import { RegisterUserUseCase } from './register-user.use-case.js';
import type { IdentityRepositoryPort } from '../ports/identity.repository.port.js';
import type { DomainEventPublisherPort } from '../../../../platform/domain/events/domain-event-publisher.port.js';
import type { User } from '../../domain/entities/user.entity.js';

describe('RegisterUserUseCase', () => {
  let useCase: RegisterUserUseCase;
  let mockRepo: jest.Mocked<IdentityRepositoryPort>;
  let mockEventPublisher: jest.Mocked<DomainEventPublisherPort>;

  beforeEach(() => {
    mockRepo = {
      saveUser: jest.fn().mockImplementation((u: User) => Promise.resolve(u)),
      findUserById: jest.fn(),
      findUserByEmail: jest.fn().mockResolvedValue(null),
      findUserByCode: jest.fn(),
      findAllUsers: jest.fn(),
      nextUserCode: jest.fn().mockResolvedValue('USR-000001'),
    } as unknown as jest.Mocked<IdentityRepositoryPort>;

    mockEventPublisher = {
      publish: jest.fn(),
      publishAll: jest.fn().mockResolvedValue(undefined),
    };

    useCase = new RegisterUserUseCase(mockRepo, mockEventPublisher);
  });

  it('should register a new user successfully', async () => {
    const res = await useCase.execute({
      email: 'test@tecnojack.com',
      passwordPlain: 'password123',
    });

    expect(res.code).toBe('USR-000001');
    expect(res.email).toBe('test@tecnojack.com');
    expect(mockRepo.saveUser.mock.calls.length).toBe(1);
  });
});
