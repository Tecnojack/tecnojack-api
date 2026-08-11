-- CreateEnum
CREATE TYPE "CRMPipelineStage" AS ENUM ('NEW_LEAD', 'CONTACTED', 'MEETING_SCHEDULED', 'QUOTATION_SENT', 'NEGOTIATION', 'APPROVED', 'REJECTED', 'CONVERTED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "QuotationStatus" AS ENUM ('DRAFT', 'SENT', 'APPROVED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "CRMActivityType" AS ENUM ('CALL', 'MEETING', 'NOTE', 'EMAIL_LOG', 'OTHER');

-- CreateTable
CREATE TABLE "opportunities" (
    "id" UUID NOT NULL,
    "code" VARCHAR(32) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "person_id" UUID,
    "organization_id" UUID,
    "event_id" UUID,
    "contract_id" UUID,
    "payment_id" UUID,
    "stage" "CRMPipelineStage" NOT NULL DEFAULT 'NEW_LEAD',
    "estimated_value" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'COP',
    "probability_percentage" INTEGER NOT NULL DEFAULT 10,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" UUID,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" UUID,

    CONSTRAINT "opportunities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quotations" (
    "id" UUID NOT NULL,
    "opportunity_id" UUID NOT NULL,
    "quotation_number" VARCHAR(64) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "subtotal_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "tax_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "status" "QuotationStatus" NOT NULL DEFAULT 'DRAFT',
    "valid_until" TIMESTAMP(3),
    "items_json" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quotations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_journeys" (
    "id" UUID NOT NULL,
    "opportunity_id" UUID NOT NULL,
    "from_stage" "CRMPipelineStage" NOT NULL,
    "to_stage" "CRMPipelineStage" NOT NULL,
    "notes" TEXT,
    "changed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actor_id" UUID,

    CONSTRAINT "customer_journeys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm_activities" (
    "id" UUID NOT NULL,
    "opportunity_id" UUID NOT NULL,
    "activity_type" "CRMActivityType" NOT NULL DEFAULT 'NOTE',
    "title" VARCHAR(255) NOT NULL,
    "notes" TEXT,
    "occurred_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actor_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "crm_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm_tasks" (
    "id" UUID NOT NULL,
    "opportunity_id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "due_date" TIMESTAMP(3) NOT NULL,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "crm_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "opportunities_code_key" ON "opportunities"("code");

-- CreateIndex
CREATE INDEX "opportunities_code_idx" ON "opportunities"("code");

-- CreateIndex
CREATE INDEX "opportunities_person_id_idx" ON "opportunities"("person_id");

-- CreateIndex
CREATE INDEX "opportunities_organization_id_idx" ON "opportunities"("organization_id");

-- CreateIndex
CREATE INDEX "opportunities_event_id_idx" ON "opportunities"("event_id");

-- CreateIndex
CREATE INDEX "opportunities_stage_idx" ON "opportunities"("stage");

-- CreateIndex
CREATE INDEX "opportunities_deleted_at_idx" ON "opportunities"("deleted_at") WHERE "deleted_at" IS NULL;

-- CreateIndex
CREATE INDEX "quotations_opportunity_id_idx" ON "quotations"("opportunity_id");

-- CreateIndex
CREATE INDEX "quotations_status_idx" ON "quotations"("status");

-- CreateIndex
CREATE INDEX "customer_journeys_opportunity_id_idx" ON "customer_journeys"("opportunity_id");

-- CreateIndex
CREATE INDEX "crm_activities_opportunity_id_idx" ON "crm_activities"("opportunity_id");

-- CreateIndex
CREATE INDEX "crm_activities_activity_type_idx" ON "crm_activities"("activity_type");

-- CreateIndex
CREATE INDEX "crm_tasks_opportunity_id_idx" ON "crm_tasks"("opportunity_id");

-- CreateIndex
CREATE INDEX "crm_tasks_due_date_idx" ON "crm_tasks"("due_date");

-- CreateIndex
CREATE INDEX "crm_tasks_is_completed_idx" ON "crm_tasks"("is_completed");

-- AddForeignKey
ALTER TABLE "quotations" ADD CONSTRAINT "quotations_opportunity_id_fkey" FOREIGN KEY ("opportunity_id") REFERENCES "opportunities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_journeys" ADD CONSTRAINT "customer_journeys_opportunity_id_fkey" FOREIGN KEY ("opportunity_id") REFERENCES "opportunities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_activities" ADD CONSTRAINT "crm_activities_opportunity_id_fkey" FOREIGN KEY ("opportunity_id") REFERENCES "opportunities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_tasks" ADD CONSTRAINT "crm_tasks_opportunity_id_fkey" FOREIGN KEY ("opportunity_id") REFERENCES "opportunities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
