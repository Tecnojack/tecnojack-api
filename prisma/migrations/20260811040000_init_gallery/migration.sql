-- CreateEnum
CREATE TYPE "GalleryStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'UNPUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "GalleryVisibility" AS ENUM ('PUBLIC', 'PRIVATE', 'PASSWORD_PROTECTED');

-- CreateTable
CREATE TABLE "galleries" (
    "id" UUID NOT NULL,
    "code" VARCHAR(32) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255),
    "description" TEXT,
    "event_id" UUID NOT NULL,
    "status" "GalleryStatus" NOT NULL DEFAULT 'DRAFT',
    "visibility" "GalleryVisibility" NOT NULL DEFAULT 'PRIVATE',
    "password" VARCHAR(128),
    "cover_media_asset_id" UUID,
    "allow_download" BOOLEAN NOT NULL DEFAULT false,
    "allow_favorites" BOOLEAN NOT NULL DEFAULT false,
    "allow_comments" BOOLEAN NOT NULL DEFAULT false,
    "published_at" TIMESTAMP(3),
    "archived_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" UUID,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" UUID,

    CONSTRAINT "galleries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gallery_albums" (
    "id" UUID NOT NULL,
    "gallery_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "cover_media_asset_id" UUID,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gallery_albums_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gallery_asset_references" (
    "id" UUID NOT NULL,
    "gallery_id" UUID NOT NULL,
    "album_id" UUID,
    "media_asset_id" UUID NOT NULL,
    "title" VARCHAR(255),
    "caption" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gallery_asset_references_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "galleries_code_key" ON "galleries"("code");

-- CreateIndex
CREATE UNIQUE INDEX "galleries_slug_key" ON "galleries"("slug");

-- CreateIndex
CREATE INDEX "galleries_code_idx" ON "galleries"("code");

-- CreateIndex
CREATE INDEX "galleries_event_id_idx" ON "galleries"("event_id");

-- CreateIndex
CREATE INDEX "galleries_status_idx" ON "galleries"("status");

-- CreateIndex
CREATE INDEX "galleries_deleted_at_idx" ON "galleries"("deleted_at") WHERE "deleted_at" IS NULL;

-- CreateIndex
CREATE INDEX "gallery_albums_gallery_id_idx" ON "gallery_albums"("gallery_id");

-- CreateIndex
CREATE INDEX "gallery_asset_references_gallery_id_idx" ON "gallery_asset_references"("gallery_id");

-- CreateIndex
CREATE INDEX "gallery_asset_references_album_id_idx" ON "gallery_asset_references"("album_id");

-- CreateIndex
CREATE INDEX "gallery_asset_references_media_asset_id_idx" ON "gallery_asset_references"("media_asset_id");

-- CreateIndex
CREATE UNIQUE INDEX "gallery_asset_references_gallery_id_media_asset_id_key" ON "gallery_asset_references"("gallery_id", "media_asset_id");

-- AddForeignKey
ALTER TABLE "gallery_albums" ADD CONSTRAINT "gallery_albums_gallery_id_fkey" FOREIGN KEY ("gallery_id") REFERENCES "galleries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gallery_asset_references" ADD CONSTRAINT "gallery_asset_references_gallery_id_fkey" FOREIGN KEY ("gallery_id") REFERENCES "galleries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gallery_asset_references" ADD CONSTRAINT "gallery_asset_references_album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "gallery_albums"("id") ON DELETE SET NULL ON UPDATE CASCADE;
