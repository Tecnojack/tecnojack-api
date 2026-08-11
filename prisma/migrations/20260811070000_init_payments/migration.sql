-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('DRAFT', 'PENDING', 'PARTIALLY_PAID', 'PAID', 'OVERDUE', 'REFUNDED', 'CANCELLED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "PaymentPlan" AS ENUM ('FULL_PAYMENT', 'INSTALLMENTS', 'MILESTONE_BASED', 'CUSTOM');

-- CreateEnum
CREATE TYPE "InstallmentStatus" AS ENUM ('PENDING', 'PARTIALLY_PAID', 'PAID', 'OVERDUE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'BANK_TRANSFER', 'CREDIT_CARD', 'DEBIT_CARD', 'MANUAL_RECORD', 'EXTERNAL_ADAPTER', 'OTHER');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('PAYMENT', 'PARTIAL_PAYMENT', 'REFUND', 'ADJUSTMENT');

-- CreateTable
CREATE TABLE "payments" (
    "id" UUID NOT NULL,
    "code" VARCHAR(32) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "event_id" UUID NOT NULL,
    "contract_id" UUID,
    "deliverable_id" UUID,
    "payer_person_id" UUID,
    "payer_organization_id" UUID,
    "status" "PaymentStatus" NOT NULL DEFAULT 'DRAFT',
    "payment_plan" "PaymentPlan" NOT NULL DEFAULT 'FULL_PAYMENT',
    "total_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "paid_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "pending_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'COP',
    "due_date" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" UUID,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" UUID,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_installments" (
    "id" UUID NOT NULL,
    "payment_id" UUID NOT NULL,
    "installment_number" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "paid_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "status" "InstallmentStatus" NOT NULL DEFAULT 'PENDING',
    "due_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_installments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_transactions" (
    "id" UUID NOT NULL,
    "payment_id" UUID NOT NULL,
    "installment_id" UUID,
    "transaction_type" "TransactionType" NOT NULL DEFAULT 'PAYMENT',
    "payment_method" "PaymentMethod" NOT NULL DEFAULT 'CASH',
    "amount" DECIMAL(12,2) NOT NULL,
    "reference_number" VARCHAR(128),
    "notes" TEXT,
    "transaction_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actor_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payments_code_key" ON "payments"("code");

-- CreateIndex
CREATE INDEX "payments_code_idx" ON "payments"("code");

-- CreateIndex
CREATE INDEX "payments_event_id_idx" ON "payments"("event_id");

-- CreateIndex
CREATE INDEX "payments_contract_id_idx" ON "payments"("contract_id");

-- CreateIndex
CREATE INDEX "payments_deliverable_id_idx" ON "payments"("deliverable_id");

-- CreateIndex
CREATE INDEX "payments_status_idx" ON "payments"("status");

-- CreateIndex
CREATE INDEX "payments_deleted_at_idx" ON "payments"("deleted_at") WHERE "deleted_at" IS NULL;

-- CreateIndex
CREATE UNIQUE INDEX "payment_installments_payment_id_installment_number_key" ON "payment_installments"("payment_id", "installment_number");

-- CreateIndex
CREATE INDEX "payment_installments_payment_id_idx" ON "payment_installments"("payment_id");

-- CreateIndex
CREATE INDEX "payment_installments_status_idx" ON "payment_installments"("status");

-- CreateIndex
CREATE INDEX "payment_transactions_payment_id_idx" ON "payment_transactions"("payment_id");

-- CreateIndex
CREATE INDEX "payment_transactions_installment_id_idx" ON "payment_transactions"("installment_id");

-- CreateIndex
CREATE INDEX "payment_transactions_transaction_type_idx" ON "payment_transactions"("transaction_type");

-- AddForeignKey
ALTER TABLE "payment_installments" ADD CONSTRAINT "payment_installments_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_installment_id_fkey" FOREIGN KEY ("installment_id") REFERENCES "payment_installments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
