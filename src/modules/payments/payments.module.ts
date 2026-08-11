import { Module } from '@nestjs/common';
import { EventsModule } from '../events/events.module.js';
import { PeopleModule } from '../people/people.module.js';
import { ContractsModule } from '../contracts/contracts.module.js';
import { DeliverablesModule } from '../deliverables/deliverables.module.js';
import { PAYMENT_REPOSITORY } from './application/ports/payment.repository.port.js';
import { PrismaPaymentRepository } from './infrastructure/persistence/prisma/repositories/prisma-payment.repository.js';
import { CreatePaymentUseCase } from './application/create-payment/create-payment.use-case.js';
import { GetPaymentUseCase } from './application/get-payment/get-payment.use-case.js';
import { RegisterTransactionUseCase } from './application/register-transaction/register-transaction.use-case.js';
import { ManagePaymentInstallmentsUseCase } from './application/manage-payment-installments/manage-payment-installments.use-case.js';
import { ManagePaymentStateUseCase } from './application/manage-payment-state/manage-payment-state.use-case.js';
import { ListPaymentsUseCase } from './application/list-payments/list-payments.use-case.js';
import { PaymentsController } from './presentation/http/controllers/payments.controller.js';
import { PaymentFacade } from './public/payment.facade.js';

@Module({
  imports: [EventsModule, PeopleModule, ContractsModule, DeliverablesModule],
  controllers: [PaymentsController],
  providers: [
    {
      provide: PAYMENT_REPOSITORY,
      useClass: PrismaPaymentRepository,
    },
    CreatePaymentUseCase,
    GetPaymentUseCase,
    RegisterTransactionUseCase,
    ManagePaymentInstallmentsUseCase,
    ManagePaymentStateUseCase,
    ListPaymentsUseCase,
    PaymentFacade,
  ],
  exports: [PaymentFacade, PAYMENT_REPOSITORY],
})
export class PaymentsModule {}
