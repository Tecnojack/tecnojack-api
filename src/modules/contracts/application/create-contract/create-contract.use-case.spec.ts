import { CreateContractUseCase } from './create-contract.use-case.js';
import type { ContractRepositoryPort } from '../ports/contract.repository.port.js';
import type { EventsFacade } from '../../../events/public/events.facade.js';
import type { DeliverableFacade } from '../../../deliverables/public/deliverable.facade.js';
import type { DomainEventPublisherPort } from '../../../../platform/domain/events/domain-event-publisher.port.js';
import type { Contract } from '../../domain/entities/contract.entity.js';
import { ContractStatus, ContractTemplateType } from '../../domain/enums/contracts.enums.js';

describe('CreateContractUseCase', () => {
  let useCase: CreateContractUseCase;
  let mockContractRepo: jest.Mocked<ContractRepositoryPort>;
  let mockEventsFacade: jest.Mocked<EventsFacade>;
  let mockDeliverableFacade: jest.Mocked<DeliverableFacade>;
  let mockEventPublisher: jest.Mocked<DomainEventPublisherPort>;

  beforeEach(() => {
    mockContractRepo = {
      save: jest.fn().mockImplementation((c: Contract) => Promise.resolve(c)),
      findById: jest.fn(),
      findByCode: jest.fn(),
      findAll: jest.fn(),
      nextCode: jest.fn().mockResolvedValue('CTR-000001'),
    };

    mockEventsFacade = {
      getEvent: jest.fn().mockResolvedValue({ id: 'event-1' }),
    } as unknown as jest.Mocked<EventsFacade>;

    mockDeliverableFacade = {
      getDeliverable: jest.fn().mockResolvedValue({ id: 'deliverable-1' }),
    } as unknown as jest.Mocked<DeliverableFacade>;

    mockEventPublisher = {
      publish: jest.fn(),
      publishAll: jest.fn().mockResolvedValue(undefined),
    };

    useCase = new CreateContractUseCase(
      mockContractRepo,
      mockEventsFacade,
      mockDeliverableFacade,
      mockEventPublisher,
    );
  });

  it('should create a DRAFT contract verifying Event and Deliverable via facades', async () => {
    const contract = await useCase.execute({
      title: 'Contrato de Servicios Fotográficos',
      eventId: 'event-1',
      deliverableId: 'deliverable-1',
      templateType: ContractTemplateType.SERVICE_AGREEMENT,
    });

    expect(contract.code).toBe('CTR-000001');
    expect(contract.title).toBe('Contrato de Servicios Fotográficos');
    expect(contract.status).toBe(ContractStatus.DRAFT);
    expect(mockEventsFacade.getEvent.mock.calls.length).toBe(1);
    expect(mockDeliverableFacade.getDeliverable.mock.calls.length).toBe(1);
    expect(mockContractRepo.save.mock.calls.length).toBe(1);
    expect(mockEventPublisher.publishAll.mock.calls.length).toBe(1);
  });
});
