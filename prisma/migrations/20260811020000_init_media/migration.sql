-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT', 'ARCHIVE', 'OTHER');

-- CreateEnum
CREATE TYPE "MediaStatus" AS ENUM ('PROCESSING', 'READY', 'FAILED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "media_assets" (
    "id" UUID NOT NULL,
    "code" VARCHAR(32) NOT NULL,
    "type" "MediaType" NOT NULL,
    "status" "MediaStatus" NOT NULL DEFAULT 'READY',
    "original_name" VARCHAR(255) NOT NULL,
    "normalized_name" VARCHAR(255) NOT NULL,
    "mime_type" VARCHAR(127) NOT NULL,
    "size_bytes" BIGINT NOT NULL,
    "path" VARCHAR(512) NOT NULL,
    "url" VARCHAR(1024) NOT NULL,
    "checksum_algo" VARCHAR(32),
    "checksum_hash" VARCHAR(128),
    "width" INTEGER,
    "height" INTEGER,
    "aspect_ratio" VARCHAR(20),
    "duration_sec" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" UUID,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" UUID,

    CONSTRAINT "media_assets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "media_assets_code_key" ON "media_assets"("code");

-- CreateIndex
CREATE INDEX "media_assets_code_idx" ON "media_assets"("code");

-- CreateIndex
CREATE INDEX "media_assets_type_idx" ON "media_assets"("type");

-- CreateIndex
CREATE INDEX "media_assets_status_idx" ON "media_assets"("status");

-- CreateIndex
CREATE INDEX "media_assets_checksum_hash_idx" ON "media_assets"("checksum_hash");

-- CreateIndex
CREATE INDEX "media_assets_deleted_at_idx" ON "media_assets"("deleted_at") WHERE "deleted_at" IS NULL;
