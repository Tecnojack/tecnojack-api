-- CreateEnum
CREATE TYPE "DeliverableType" AS ENUM ('PHOTOS', 'VIDEOS', 'DIGITAL_ALBUM', 'PRINTED_ALBUM', 'USB_DRIVE', 'DOWNLOAD_LINK', 'CUSTOM');

-- CreateEnum
CREATE TYPE "DeliverableStatus" AS ENUM ('DRAFT', 'IN_PROGRESS', 'READY', 'DELIVERED', 'CANCELLED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "DeliveryMethod" AS ENUM ('DIGITAL_DOWNLOAD', 'PHYSICAL_SHIPPING', 'IN_PERSON_PICKUP', 'COURIER', 'THIRD_PARTY_SERVICE', 'OTHER');

-- CreateTable
CREATE TABLE "deliverables" (
    "id" UUID NOT NULL,
    "code" VARCHAR(32) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "event_id" UUID NOT NULL,
    "type" "DeliverableType" NOT NULL DEFAULT 'PHOTOS',
    "status" "DeliverableStatus" NOT NULL DEFAULT 'DRAFT',
    "delivery_method" "DeliveryMethod" NOT NULL DEFAULT 'DIGITAL_DOWNLOAD',
    "recipient_person_id" UUID,
    "target_gallery_id" UUID,
    "estimated_delivery_at" TIMESTAMP(3),
    "delivered_at" TIMESTAMP(3),
    "tracking_number" VARCHAR(128),
    "delivery_notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" UUID,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" UUID,

    CONSTRAINT "deliverables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deliverable_items" (
    "id" UUID NOT NULL,
    "deliverable_id" UUID NOT NULL,
    "media_asset_id" UUID,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "deliverable_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "deliverables_code_key" ON "deliverables"("code");

-- CreateIndex
CREATE INDEX "deliverables_code_idx" ON "deliverables"("code");

-- CreateIndex
CREATE INDEX "deliverables_event_id_idx" ON "deliverables"("event_id");

-- CreateIndex
CREATE INDEX "deliverables_status_idx" ON "deliverables"("status");

-- CreateIndex
CREATE INDEX "deliverables_type_idx" ON "deliverables"("type");

-- CreateIndex
CREATE INDEX "deliverables_deleted_at_idx" ON "deliverables"("deleted_at") WHERE "deleted_at" IS NULL;

-- CreateIndex
CREATE INDEX "deliverable_items_deliverable_id_idx" ON "deliverable_items"("deliverable_id");

-- CreateIndex
CREATE INDEX "deliverable_items_media_asset_id_idx" ON "deliverable_items"("media_asset_id");

-- AddForeignKey
ALTER TABLE "deliverable_items" ADD CONSTRAINT "deliverable_items_deliverable_id_fkey" FOREIGN KEY ("deliverable_id") REFERENCES "deliverables"("id") ON DELETE CASCADE ON UPDATE CASCADE;
