-- CreateEnum
CREATE TYPE "PersonStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "OrganizationStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('NATIONAL_ID', 'PASSPORT', 'TAX_ID', 'FOREIGN_ID', 'DRIVERS_LICENSE', 'OTHER');

-- CreateEnum
CREATE TYPE "ContactType" AS ENUM ('EMAIL', 'PHONE', 'WHATSAPP', 'ADDRESS', 'WEBSITE', 'SOCIAL_MEDIA');

-- CreateTable
CREATE TABLE "persons" (
    "id" UUID NOT NULL,
    "code" VARCHAR(32) NOT NULL,
    "given_names" VARCHAR(150) NOT NULL,
    "family_names" VARCHAR(150),
    "display_name" VARCHAR(300) NOT NULL,
    "prefix" VARCHAR(20),
    "suffix" VARCHAR(20),
    "document_issuing_country" VARCHAR(2),
    "document_type" "DocumentType",
    "document_number" VARCHAR(60),
    "document_formatted" VARCHAR(100),
    "status" "PersonStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" UUID,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" UUID,

    CONSTRAINT "persons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "person_contact_information" (
    "id" UUID NOT NULL,
    "person_id" UUID NOT NULL,
    "type" "ContactType" NOT NULL,
    "value" TEXT NOT NULL,
    "label" VARCHAR(100),
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "person_contact_information_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organizations" (
    "id" UUID NOT NULL,
    "code" VARCHAR(32) NOT NULL,
    "legal_name" VARCHAR(200) NOT NULL,
    "trade_name" VARCHAR(200),
    "tax_id_issuing_country" VARCHAR(2),
    "tax_id_number" VARCHAR(60),
    "tax_id_verification_digit" VARCHAR(10),
    "status" "OrganizationStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" UUID,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" UUID,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization_contact_information" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "type" "ContactType" NOT NULL,
    "value" TEXT NOT NULL,
    "label" VARCHAR(100),
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organization_contact_information_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "persons_code_key" ON "persons"("code");

-- CreateIndex
CREATE INDEX "persons_code_idx" ON "persons"("code");

-- CreateIndex
CREATE INDEX "persons_status_idx" ON "persons"("status");

-- CreateIndex
CREATE INDEX "persons_deleted_at_idx" ON "persons"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "persons_document_issuing_country_document_type_document_num_key" ON "persons"("document_issuing_country", "document_type", "document_number");

-- CreateIndex
CREATE INDEX "person_contact_information_person_id_idx" ON "person_contact_information"("person_id");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_code_key" ON "organizations"("code");

-- CreateIndex
CREATE INDEX "organizations_code_idx" ON "organizations"("code");

-- CreateIndex
CREATE INDEX "organizations_status_idx" ON "organizations"("status");

-- CreateIndex
CREATE INDEX "organizations_deleted_at_idx" ON "organizations"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_tax_id_issuing_country_tax_id_number_key" ON "organizations"("tax_id_issuing_country", "tax_id_number");

-- CreateIndex
CREATE INDEX "organization_contact_information_organization_id_idx" ON "organization_contact_information"("organization_id");

-- AddForeignKey
ALTER TABLE "person_contact_information" ADD CONSTRAINT "person_contact_information_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_contact_information" ADD CONSTRAINT "organization_contact_information_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
