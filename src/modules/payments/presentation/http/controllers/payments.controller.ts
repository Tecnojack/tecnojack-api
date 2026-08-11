import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CreatePaymentUseCase } from '../../../application/create-payment/create-payment.use-case.js';
import { GetPaymentUseCase } from '../../../application/get-payment/get-payment.use-case.js';
import { RegisterTransactionUseCase } from '../../../application/register-transaction/register-transaction.use-case.js';
import { ManagePaymentInstallmentsUseCase } from '../../../application/manage-payment-installments/manage-payment-installments.use-case.js';
import { ManagePaymentStateUseCase } from '../../../application/manage-payment-state/manage-payment-state.use-case.js';
import { ListPaymentsUseCase } from '../../../application/list-payments/list-payments.use-case.js';
import { CreatePaymentDto } from '../dtos/create-payment.dto.js';
import { QueryPaymentsDto } from '../dtos/query-payments.dto.js';
import { AddPaymentInstallmentDto } from '../dtos/add-payment-installment.dto.js';
import { RegisterPaymentTransactionDto } from '../dtos/register-payment-transaction.dto.js';
import { PaymentResponseDto } from '../dtos/payment-response.dto.js';

export interface PaginatedPaymentsResponse {
  data: PaymentResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly createPaymentUseCase: CreatePaymentUseCase,
    private readonly getPaymentUseCase: GetPaymentUseCase,
    private readonly registerTransactionUseCase: RegisterTransactionUseCase,
    private readonly managePaymentInstallmentsUseCase: ManagePaymentInstallmentsUseCase,
    private readonly managePaymentStateUseCase: ManagePaymentStateUseCase,
    private readonly listPaymentsUseCase: ListPaymentsUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new payment record' })
  @ApiResponse({ status: 201, type: PaymentResponseDto })
  async create(@Body() dto: CreatePaymentDto): Promise<PaymentResponseDto> {
    const payment = await this.createPaymentUseCase.execute({
      title: dto.title,
      description: dto.description,
      eventId: dto.eventId,
      contractId: dto.contractId,
      deliverableId: dto.deliverableId,
      payerPersonId: dto.payerPersonId,
      payerOrganizationId: dto.payerOrganizationId,
      totalAmount: dto.totalAmount,
      currency: dto.currency,
      paymentPlan: dto.paymentPlan,
      dueDate: dto.dueDate,
    });
    return PaymentResponseDto.fromDomain(payment);
  }

  @Get()
  @ApiOperation({ summary: 'List payments with pagination and filters' })
  @ApiResponse({ status: 200 })
  async findAll(@Query() query: QueryPaymentsDto): Promise<PaginatedPaymentsResponse> {
    const result = await this.listPaymentsUseCase.execute({
      page: query.page,
      limit: query.limit,
      eventId: query.eventId,
      contractId: query.contractId,
      deliverableId: query.deliverableId,
      payerPersonId: query.payerPersonId,
      payerOrganizationId: query.payerOrganizationId,
      status: query.status,
      paymentPlan: query.paymentPlan,
      search: query.search,
      includeDeleted: query.includeDeleted,
    });

    return {
      data: result.data.map((p) => PaymentResponseDto.fromDomain(p)),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }

  @Get(':identifier')
  @ApiOperation({ summary: 'Get payment by ID or code (PAY-XXXXXX)' })
  @ApiParam({ name: 'identifier', description: 'UUID or Business Code (PAY-XXXXXX)' })
  @ApiResponse({ status: 200, type: PaymentResponseDto })
  async findOne(@Param('identifier') identifier: string): Promise<PaymentResponseDto> {
    const payment = await this.getPaymentUseCase.execute(identifier);
    return PaymentResponseDto.fromDomain(payment);
  }

  @Post(':id/transactions')
  @ApiOperation({ summary: 'Register a financial transaction (payment, abono, refund, adjustment)' })
  @ApiResponse({ status: 201, type: PaymentResponseDto })
  async registerTransaction(
    @Param('id') paymentId: string,
    @Body() dto: RegisterPaymentTransactionDto,
  ): Promise<PaymentResponseDto> {
    const payment = await this.registerTransactionUseCase.execute({
      paymentId,
      installmentId: dto.installmentId,
      transactionType: dto.transactionType,
      paymentMethod: dto.paymentMethod,
      amount: dto.amount,
      referenceNumber: dto.referenceNumber,
      notes: dto.notes,
      transactionDate: dto.transactionDate,
    });
    return PaymentResponseDto.fromDomain(payment);
  }

  @Post(':id/installments')
  @ApiOperation({ summary: 'Add an installment to a payment plan' })
  @ApiResponse({ status: 201, type: PaymentResponseDto })
  async addInstallment(
    @Param('id') paymentId: string,
    @Body() dto: AddPaymentInstallmentDto,
  ): Promise<PaymentResponseDto> {
    const payment = await this.managePaymentInstallmentsUseCase.addInstallment({
      paymentId,
      title: dto.title,
      amount: dto.amount,
      dueDate: dto.dueDate,
    });
    return PaymentResponseDto.fromDomain(payment);
  }

  @Post(':id/overdue')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark payment as overdue' })
  @ApiResponse({ status: 200, type: PaymentResponseDto })
  async markAsOverdue(@Param('id') id: string): Promise<PaymentResponseDto> {
    const payment = await this.managePaymentStateUseCase.markAsOverdue(id);
    return PaymentResponseDto.fromDomain(payment);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft-delete (archive) a payment' })
  @ApiResponse({ status: 200, type: PaymentResponseDto })
  async archive(@Param('id') id: string): Promise<PaymentResponseDto> {
    const payment = await this.managePaymentStateUseCase.archive(id);
    return PaymentResponseDto.fromDomain(payment);
  }

  @Post(':id/restore')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Restore an archived payment' })
  @ApiResponse({ status: 200, type: PaymentResponseDto })
  async restore(@Param('id') id: string): Promise<PaymentResponseDto> {
    const payment = await this.managePaymentStateUseCase.restore(id);
    return PaymentResponseDto.fromDomain(payment);
  }
}
