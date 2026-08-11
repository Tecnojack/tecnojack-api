import { Injectable, Inject } from '@nestjs/common';
import {
  IDENTITY_REPOSITORY,
  type IdentityRepositoryPort,
} from '../ports/identity.repository.port.js';
import { User } from '../../domain/entities/user.entity.js';
import { PasswordHash } from '../../domain/value-objects/password-hash.value-object.js';
import {
  DOMAIN_EVENT_PUBLISHER,
  type DomainEventPublisherPort,
} from '../../../../platform/domain/events/domain-event-publisher.port.js';

export interface RegisterUserCommand {
  email: string;
  passwordPlain: string;
  tenantId?: string;
  actorId?: string;
}

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(IDENTITY_REPOSITORY)
    private readonly repo: IdentityRepositoryPort,
    @Inject(DOMAIN_EVENT_PUBLISHER)
    private readonly eventPublisher: DomainEventPublisherPort,
  ) {}

  async execute(command: RegisterUserCommand): Promise<User> {
    const existing = await this.repo.findUserByEmail(command.email);
    if (existing) {
      throw new Error(`Email "${command.email}" is already in use.`);
    }

    const passwordHash = PasswordHash.create(command.passwordPlain);
    const code = await this.repo.nextUserCode();

    const user = User.create(
      {
        code,
        email: command.email,
        passwordHash,
        tenantId: command.tenantId,
      },
      command.actorId,
    );

    const saved = await this.repo.saveUser(user);
    await this.eventPublisher.publishAll(user.domainEvents);
    user.clearDomainEvents();

    return saved;
  }
}
