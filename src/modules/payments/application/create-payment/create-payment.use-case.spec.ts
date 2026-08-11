import { CreatePaymentUseCase } from './create-payment.use-case.js';
import type { PaymentRepositoryPort } from '../ports/payment.repository.port.js';
import type { EventsFacade } from '../../../events/public/events.facade.js';
import type { ContractFacade } from '../../../contracts/public/contract.facade.js';
import type { DeliverableFacade } from '../../../deliverables/public/deliverable.facade.js';
import type { PeopleFacade } from '../../../people/public/people.facade.js';
import type { DomainEventPublisherPort } from '../../../../platform/domain/events/domain-event-publisher.port.js';
import type { Payment } from '../../domain/entities/payment.entity.js';
import { PaymentStatus, PaymentPlan } from '../../domain/enums/payments.enums.js';

describe('CreatePaymentUseCase', () => {
  let useCase: CreatePaymentUseCase;
  let mockPaymentRepo: jest.Mocked<PaymentRepositoryPort>;
  let mockEventsFacade: jest.Mocked<EventsFacade>;
  let mockContractsFacade: jest.Mocked<ContractFacade>;
  let mockDeliverableFacade: jest.Mocked<DeliverableFacade>;
  let mockPeopleFacade: jest.Mocked<PeopleFacade>;
  let mockEventPublisher: jest.Mocked<DomainEventPublisherPort>;

  beforeEach(() => {
    mockPaymentRepo = {
      save: jest.fn().mockImplementation((p: Payment) => Promise.resolve(p)),
      findById: jest.fn(),
      findByCode: jest.fn(),
      findAll: jest.fn(),
      nextCode: jest.fn().mockResolvedValue('PAY-000001'),
    };

    mockEventsFacade = {
      getEvent: jest.fn().mockResolvedValue({ id: 'event-1' }),
    } as unknown as jest.Mocked<EventsFacade>;

    mockContractsFacade = {
      getContract: jest.fn().mockResolvedValue({ id: 'contract-1' }),
    } as unknown as jest.Mocked<ContractFacade>;

    mockDeliverableFacade = {
      getDeliverable: jest.fn().mockResolvedValue({ id: 'deliverable-1' }),
    } as unknown as jest.Mocked<DeliverableFacade>;

    mockPeopleFacade = {
      findPersonByIdOrCode: jest.fn().mockResolvedValue({ id: 'person-1' }),
      findOrganizationByIdOrCode: jest.fn(),
    } as unknown as jest.Mocked<PeopleFacade>;

    mockEventPublisher = {
      publish: jest.fn(),
      publishAll: jest.fn().mockResolvedValue(undefined),
    };

    useCase = new CreatePaymentUseCase(
      mockPaymentRepo,
      mockEventsFacade,
      mockContractsFacade,
      mockDeliverableFacade,
      mockPeopleFacade,
      mockEventPublisher,
    );
  });

  it('should create a DRAFT payment verifying Event, Contract, Deliverable, and Person via facades', async () => {
    const payment = await useCase.execute({
      title: 'Cobro por Servicios Fotográficos',
      eventId: 'event-1',
      contractId: 'contract-1',
      deliverableId: 'deliverable-1',
      payerPersonId: 'person-1',
      totalAmount: 3500000,
      paymentPlan: PaymentPlan.INSTALLMENTS,
    });

    expect(payment.code).toBe('PAY-000001');
    expect(payment.title).toBe('Cobro por Servicios Fotográficos');
    expect(payment.status).toBe(PaymentStatus.DRAFT);
    expect(payment.totalAmount).toBe(3500000);
    expect(mockEventsFacade.getEvent.mock.calls.length).toBe(1);
    expect(mockContractsFacade.getContract.mock.calls.length).toBe(1);
    expect(mockDeliverableFacade.getDeliverable.mock.calls.length).toBe(1);
    expect(mockPeopleFacade.findPersonByIdOrCode.mock.calls.length).toBe(1);
    expect(mockPaymentRepo.save.mock.calls.length).toBe(1);
    expect(mockEventPublisher.publishAll.mock.calls.length).toBe(1);
  });
});
