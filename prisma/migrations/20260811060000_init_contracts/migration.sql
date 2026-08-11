-- CreateEnum
CREATE TYPE "ContractStatus" AS ENUM ('DRAFT', 'PENDING_SIGNATURE', 'PARTIALLY_SIGNED', 'EXECUTED', 'CANCELLED', 'EXPIRED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ContractTemplateType" AS ENUM ('SERVICE_AGREEMENT', 'MODEL_RELEASE', 'INTELLECTUAL_PROPERTY', 'EVENT_TERMS', 'CUSTOM');

-- CreateEnum
CREATE TYPE "ContractPartyRole" AS ENUM ('PROVIDER', 'CLIENT', 'WITNESS', 'GUARANTOR', 'OTHER');

-- CreateEnum
CREATE TYPE "SignatureStatus" AS ENUM ('PENDING', 'SIGNED', 'DECLINED', 'EXPIRED');

-- CreateTable
CREATE TABLE "contracts" (
    "id" UUID NOT NULL,
    "code" VARCHAR(32) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "event_id" UUID NOT NULL,
    "deliverable_id" UUID,
    "status" "ContractStatus" NOT NULL DEFAULT 'DRAFT',
    "template_type" "ContractTemplateType" NOT NULL DEFAULT 'SERVICE_AGREEMENT',
    "current_version_number" INTEGER NOT NULL DEFAULT 1,
    "notes" TEXT,
    "signed_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" UUID,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" UUID,

    CONSTRAINT "contracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contract_versions" (
    "id" UUID NOT NULL,
    "contract_id" UUID NOT NULL,
    "version_number" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "content_summary" TEXT,
    "clauses_json" JSONB,
    "change_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID,

    CONSTRAINT "contract_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contract_parties" (
    "id" UUID NOT NULL,
    "contract_id" UUID NOT NULL,
    "person_id" UUID,
    "organization_id" UUID,
    "role" "ContractPartyRole" NOT NULL DEFAULT 'CLIENT',
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contract_parties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contract_signatures" (
    "id" UUID NOT NULL,
    "contract_id" UUID NOT NULL,
    "party_id" UUID NOT NULL,
    "status" "SignatureStatus" NOT NULL DEFAULT 'PENDING',
    "signer_name" VARCHAR(255),
    "signer_email" VARCHAR(255),
    "signature_provider" VARCHAR(64),
    "external_envelope_id" VARCHAR(128),
    "signed_at" TIMESTAMP(3),
    "ip_address" VARCHAR(64),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contract_signatures_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "contracts_code_key" ON "contracts"("code");

-- CreateIndex
CREATE INDEX "contracts_code_idx" ON "contracts"("code");

-- CreateIndex
CREATE INDEX "contracts_event_id_idx" ON "contracts"("event_id");

-- CreateIndex
CREATE INDEX "contracts_deliverable_id_idx" ON "contracts"("deliverable_id");

-- CreateIndex
CREATE INDEX "contracts_status_idx" ON "contracts"("status");

-- CreateIndex
CREATE INDEX "contracts_deleted_at_idx" ON "contracts"("deleted_at") WHERE "deleted_at" IS NULL;

-- CreateIndex
CREATE UNIQUE INDEX "contract_versions_contract_id_version_number_key" ON "contract_versions"("contract_id", "version_number");

-- CreateIndex
CREATE INDEX "contract_versions_contract_id_idx" ON "contract_versions"("contract_id");

-- CreateIndex
CREATE INDEX "contract_parties_contract_id_idx" ON "contract_parties"("contract_id");

-- CreateIndex
CREATE INDEX "contract_parties_person_id_idx" ON "contract_parties"("person_id");

-- CreateIndex
CREATE INDEX "contract_parties_organization_id_idx" ON "contract_parties"("organization_id");

-- CreateIndex
CREATE INDEX "contract_signatures_contract_id_idx" ON "contract_signatures"("contract_id");

-- CreateIndex
CREATE INDEX "contract_signatures_party_id_idx" ON "contract_signatures"("party_id");

-- CreateIndex
CREATE INDEX "contract_signatures_status_idx" ON "contract_signatures"("status");

-- AddForeignKey
ALTER TABLE "contract_versions" ADD CONSTRAINT "contract_versions_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "contracts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contract_parties" ADD CONSTRAINT "contract_parties_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "contracts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contract_signatures" ADD CONSTRAINT "contract_signatures_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "contracts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contract_signatures" ADD CONSTRAINT "contract_signatures_party_id_fkey" FOREIGN KEY ("party_id") REFERENCES "contract_parties"("id") ON DELETE CASCADE ON UPDATE CASCADE;
