import { PaymentsController } from './payments.controller.js';
import type { CreatePaymentUseCase } from '../../../application/create-payment/create-payment.use-case.js';
import type { GetPaymentUseCase } from '../../../application/get-payment/get-payment.use-case.js';
import type { RegisterTransactionUseCase } from '../../../application/register-transaction/register-transaction.use-case.js';
import type { ManagePaymentInstallmentsUseCase } from '../../../application/manage-payment-installments/manage-payment-installments.use-case.js';
import type { ManagePaymentStateUseCase } from '../../../application/manage-payment-state/manage-payment-state.use-case.js';
import type { ListPaymentsUseCase } from '../../../application/list-payments/list-payments.use-case.js';
import { Payment } from '../../../domain/entities/payment.entity.js';
import { PaymentMethod, TransactionType } from '../../../domain/enums/payments.enums.js';

describe('PaymentsController', () => {
  let controller: PaymentsController;
  let samplePayment: Payment;

  beforeEach(() => {
    samplePayment = Payment.create({
      code: 'PAY-000001',
      title: 'Cobro de Cobertura Boda',
      eventId: crypto.randomUUID(),
      totalAmount: 3500000,
    });

    const createUseCase = {
      execute: jest.fn().mockResolvedValue(samplePayment),
    } as unknown as CreatePaymentUseCase;

    const getUseCase = {
      execute: jest.fn().mockResolvedValue(samplePayment),
    } as unknown as GetPaymentUseCase;

    const transactionUseCase = {
      execute: jest.fn().mockResolvedValue(samplePayment),
    } as unknown as RegisterTransactionUseCase;

    const installmentUseCase = {
      addInstallment: jest.fn().mockResolvedValue(samplePayment),
    } as unknown as ManagePaymentInstallmentsUseCase;

    const stateUseCase = {
      markAsOverdue: jest.fn().mockResolvedValue(samplePayment),
      archive: jest.fn().mockResolvedValue(samplePayment),
      restore: jest.fn().mockResolvedValue(samplePayment),
    } as unknown as ManagePaymentStateUseCase;

    const listUseCase = {
      execute: jest.fn().mockResolvedValue({
        data: [samplePayment],
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1,
      }),
    } as unknown as ListPaymentsUseCase;

    controller = new PaymentsController(
      createUseCase,
      getUseCase,
      transactionUseCase,
      installmentUseCase,
      stateUseCase,
      listUseCase,
    );
  });

  it('should create payment via controller', async () => {
    const res = await controller.create({
      title: 'Cobro de Cobertura Boda',
      eventId: crypto.randomUUID(),
      totalAmount: 3500000,
    });
    expect(res.code).toBe('PAY-000001');
  });

  it('should get payment by identifier', async () => {
    const res = await controller.findOne('PAY-000001');
    expect(res.code).toBe('PAY-000001');
  });

  it('should register transaction via controller', async () => {
    const res = await controller.registerTransaction('PAY-000001', {
      transactionType: TransactionType.PAYMENT,
      paymentMethod: PaymentMethod.BANK_TRANSFER,
      amount: 1000000,
    });
    expect(res.code).toBe('PAY-000001');
  });

  it('should list payments', async () => {
    const res = await controller.findAll({});
    expect(res.data.length).toBe(1);
    expect(res.total).toBe(1);
  });
});
