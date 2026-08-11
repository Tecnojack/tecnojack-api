import { CreateOpportunityUseCase } from './create-opportunity.use-case.js';
import type { OpportunityRepositoryPort } from '../ports/opportunity.repository.port.js';
import type { PeopleFacade } from '../../../people/public/people.facade.js';
import type { DomainEventPublisherPort } from '../../../../platform/domain/events/domain-event-publisher.port.js';
import type { Opportunity } from '../../domain/entities/opportunity.entity.js';
import { CRMPipelineStage } from '../../domain/enums/crm.enums.js';

describe('CreateOpportunityUseCase', () => {
  let useCase: CreateOpportunityUseCase;
  let mockRepo: jest.Mocked<OpportunityRepositoryPort>;
  let mockPeopleFacade: jest.Mocked<PeopleFacade>;
  let mockEventPublisher: jest.Mocked<DomainEventPublisherPort>;

  beforeEach(() => {
    mockRepo = {
      save: jest.fn().mockImplementation((o: Opportunity) => Promise.resolve(o)),
      findById: jest.fn(),
      findByCode: jest.fn(),
      findAll: jest.fn(),
      nextCode: jest.fn().mockResolvedValue('OPP-000001'),
    };

    mockPeopleFacade = {
      findPersonByIdOrCode: jest.fn().mockResolvedValue({ id: 'person-1' }),
      findOrganizationByIdOrCode: jest.fn(),
    } as unknown as jest.Mocked<PeopleFacade>;

    mockEventPublisher = {
      publish: jest.fn(),
      publishAll: jest.fn().mockResolvedValue(undefined),
    };

    useCase = new CreateOpportunityUseCase(mockRepo, mockPeopleFacade, mockEventPublisher);
  });

  it('should register a NEW_LEAD opportunity validating Person via PeopleFacade', async () => {
    const opp = await useCase.execute({
      title: 'Boda García - Cobertura Premium',
      personId: 'person-1',
      estimatedValue: 5000000,
    });

    expect(opp.code).toBe('OPP-000001');
    expect(opp.stage).toBe(CRMPipelineStage.NEW_LEAD);
    expect(opp.estimatedValue).toBe(5000000);
    expect(mockPeopleFacade.findPersonByIdOrCode.mock.calls.length).toBe(1);
    expect(mockRepo.save.mock.calls.length).toBe(1);
    expect(mockEventPublisher.publishAll.mock.calls.length).toBe(1);
  });
});
