import { Payment } from './payment.entity.js';
import { PaymentStatus, PaymentPlan, PaymentMethod, TransactionType } from '../enums/payments.enums.js';
import { PaymentInstallment } from './payment-installment.entity.js';
import { PaymentTransaction } from './payment-transaction.entity.js';
import { PaymentAlreadyDeletedException } from '../errors/payments.errors.js';

describe('Payment Aggregate Entity', () => {
  it('should create a DRAFT payment and emit PaymentCreatedEvent', () => {
    const payment = Payment.create({
      code: 'PAY-000001',
      title: 'Pago Completo de Boda',
      eventId: crypto.randomUUID(),
      totalAmount: 5000000,
      paymentPlan: PaymentPlan.FULL_PAYMENT,
    });

    expect(payment.id).toBeDefined();
    expect(payment.code).toBe('PAY-000001');
    expect(payment.status).toBe(PaymentStatus.DRAFT);
    expect(payment.totalAmount).toBe(5000000);
    expect(payment.pendingAmount).toBe(5000000);
    expect(payment.paidAmount).toBe(0);
    expect(payment.domainEvents.length).toBe(1);
    expect(payment.domainEvents[0]!.eventName).toBe('payments.created');
  });

  it('should register partial payment and transition status to PARTIALLY_PAID then PAID', () => {
    const payment = Payment.create({
      code: 'PAY-000002',
      title: 'Pago por Cuotas',
      eventId: crypto.randomUUID(),
      totalAmount: 2000000,
      paymentPlan: PaymentPlan.INSTALLMENTS,
    });
    payment.clearDomainEvents();

    const tx1 = new PaymentTransaction({
      paymentId: payment.id,
      transactionType: TransactionType.PARTIAL_PAYMENT,
      paymentMethod: PaymentMethod.BANK_TRANSFER,
      amount: 1000000,
      referenceNumber: 'REF-111',
    });

    payment.registerTransaction(tx1, 'user-1');
    expect(payment.paidAmount).toBe(1000000);
    expect(payment.pendingAmount).toBe(1000000);
    expect(payment.status).toBe(PaymentStatus.PARTIALLY_PAID);

    const tx2 = new PaymentTransaction({
      paymentId: payment.id,
      transactionType: TransactionType.PAYMENT,
      paymentMethod: PaymentMethod.CASH,
      amount: 1000000,
      referenceNumber: 'REF-222',
    });

    payment.registerTransaction(tx2, 'user-1');
    expect(payment.paidAmount).toBe(2000000);
    expect(payment.pendingAmount).toBe(0);
    expect(payment.status).toBe(PaymentStatus.PAID);
    expect(payment.completedAt).toBeDefined();
  });

  it('should add installment and apply payment', () => {
    const payment = Payment.create({
      code: 'PAY-000003',
      title: 'Pago con Cuota Especial',
      eventId: crypto.randomUUID(),
      totalAmount: 3000000,
    });

    const installment = new PaymentInstallment({
      paymentId: payment.id,
      installmentNumber: 1,
      title: 'Cuota Inicial 50%',
      amount: 1500000,
      dueDate: new Date('2026-10-01'),
    });

    payment.addInstallment(installment);
    expect(payment.installments.length).toBe(1);

    const tx = new PaymentTransaction({
      paymentId: payment.id,
      installmentId: installment.id,
      transactionType: TransactionType.PAYMENT,
      paymentMethod: PaymentMethod.BANK_TRANSFER,
      amount: 1500000,
    });

    payment.registerTransaction(tx);
    expect(installment.paidAmount).toBe(1500000);
    expect(installment.status).toBe('PAID');
  });

  it('should soft delete and throw on subsequent mutations', () => {
    const payment = Payment.create({
      code: 'PAY-000004',
      title: 'Pago Archivable',
      eventId: crypto.randomUUID(),
      totalAmount: 1000000,
    });

    payment.softDelete('user-1');
    expect(payment.isDeleted()).toBe(true);
    expect(payment.status).toBe(PaymentStatus.ARCHIVED);

    expect(() => payment.softDelete('user-1')).toThrow(PaymentAlreadyDeletedException);
  });
});
