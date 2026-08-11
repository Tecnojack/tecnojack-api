-- CreateEnum
CREATE TYPE "EventLifecycleStatus" AS ENUM ('DRAFT', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'CLOSED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "EventProductionPhase" AS ENUM ('INQUIRY', 'PLANNING', 'PRE_PRODUCTION', 'PRODUCTION', 'POST_PRODUCTION', 'REVIEW', 'DELIVERY', 'FINISHED');

-- CreateEnum
CREATE TYPE "EventDateStatus" AS ENUM ('UNSCHEDULED', 'TENTATIVE', 'PARTIALLY_CONFIRMED', 'CONFIRMED', 'POSTPONED');

-- CreateEnum
CREATE TYPE "EventPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "EventSessionType" AS ENUM ('MEETING', 'PRE_PRODUCTION', 'REHEARSAL', 'PHOTO_SESSION', 'RECORDING', 'CEREMONY', 'RECEPTION', 'PRODUCTION', 'POST_PRODUCTION', 'DELIVERY', 'OTHER');

-- CreateEnum
CREATE TYPE "EventSessionStatus" AS ENUM ('TENTATIVE', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'POSTPONED');

-- CreateTable
CREATE TABLE "event_types" (
    "id" UUID NOT NULL,
    "code" VARCHAR(64) NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "description" TEXT,
    "color" VARCHAR(16),
    "icon" VARCHAR(64),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "default_timezone" VARCHAR(64),
    "default_priority" "EventPriority" NOT NULL DEFAULT 'MEDIUM',
    "template_version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locations" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "type" VARCHAR(64) NOT NULL DEFAULT 'VENUE',
    "address_line" VARCHAR(255),
    "city" VARCHAR(128),
    "region" VARCHAR(128),
    "country_code" CHAR(2),
    "postal_code" VARCHAR(32),
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "timezone" VARCHAR(64),
    "contact_name" VARCHAR(128),
    "contact_phone" VARCHAR(64),
    "access_instructions" TEXT,
    "parking_instructions" TEXT,
    "technical_notes" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" UUID NOT NULL,
    "code" VARCHAR(32) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255),
    "event_type_id" UUID NOT NULL,
    "lifecycle_status" "EventLifecycleStatus" NOT NULL DEFAULT 'DRAFT',
    "production_phase" "EventProductionPhase" NOT NULL DEFAULT 'INQUIRY',
    "date_status" "EventDateStatus" NOT NULL DEFAULT 'UNSCHEDULED',
    "priority" "EventPriority" NOT NULL DEFAULT 'MEDIUM',
    "owner_user_id" UUID,
    "timezone" VARCHAR(64) NOT NULL DEFAULT 'UTC',
    "estimated_start_at" TIMESTAMP(3),
    "estimated_end_at" TIMESTAMP(3),
    "confirmed_start_at" TIMESTAMP(3),
    "confirmed_end_at" TIMESTAMP(3),
    "brief_summary" TEXT,
    "brief_objectives" TEXT,
    "brief_audience" TEXT,
    "brief_creative_direction" TEXT,
    "brief_visual_references" TEXT,
    "brief_special_moments" TEXT,
    "brief_restrictions" TEXT,
    "brief_technical_requirements" TEXT,
    "brief_accessibility_requirements" TEXT,
    "brief_privacy_requirements" TEXT,
    "brief_additional_notes" TEXT,
    "cancellation_reason" TEXT,
    "cancelled_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "closed_at" TIMESTAMP(3),
    "archived_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" UUID,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" UUID,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_sessions" (
    "id" UUID NOT NULL,
    "event_id" UUID NOT NULL,
    "location_id" UUID,
    "type" "EventSessionType" NOT NULL DEFAULT 'OTHER',
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "status" "EventSessionStatus" NOT NULL DEFAULT 'TENTATIVE',
    "date_status" "EventDateStatus" NOT NULL DEFAULT 'TENTATIVE',
    "start_at" TIMESTAMP(3),
    "end_at" TIMESTAMP(3),
    "timezone" VARCHAR(64),
    "all_day" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_status_history" (
    "id" UUID NOT NULL,
    "event_id" UUID NOT NULL,
    "status_type" VARCHAR(64) NOT NULL,
    "previous_value" VARCHAR(64) NOT NULL,
    "new_value" VARCHAR(64) NOT NULL,
    "reason" TEXT,
    "changed_by" UUID,
    "changed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "event_types_code_key" ON "event_types"("code");

-- CreateIndex
CREATE UNIQUE INDEX "events_code_key" ON "events"("code");

-- CreateIndex
CREATE UNIQUE INDEX "events_slug_key" ON "events"("slug");

-- CreateIndex
CREATE INDEX "events_code_idx" ON "events"("code");

-- CreateIndex
CREATE INDEX "events_lifecycle_status_idx" ON "events"("lifecycle_status");

-- CreateIndex
CREATE INDEX "events_production_phase_idx" ON "events"("production_phase");

-- CreateIndex
CREATE INDEX "events_date_status_idx" ON "events"("date_status");

-- CreateIndex
CREATE INDEX "events_deleted_at_idx" ON "events"("deleted_at") WHERE "deleted_at" IS NULL;

-- CreateIndex
CREATE INDEX "event_sessions_event_id_idx" ON "event_sessions"("event_id");

-- CreateIndex
CREATE INDEX "event_sessions_location_id_idx" ON "event_sessions"("location_id");

-- CreateIndex
CREATE INDEX "event_status_history_event_id_idx" ON "event_status_history"("event_id");

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_event_type_id_fkey" FOREIGN KEY ("event_type_id") REFERENCES "event_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_sessions" ADD CONSTRAINT "event_sessions_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_sessions" ADD CONSTRAINT "event_sessions_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_status_history" ADD CONSTRAINT "event_status_history_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
