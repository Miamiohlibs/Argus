-- CreateEnum
CREATE TYPE "Catalog" AS ENUM ('ALMA', 'ASPACE', 'CUSTOM');

-- AlterTable
-- Rename almaId to catalogId and almaIdType to catalogIdType to preserve data
ALTER TABLE "BibEntry" RENAME COLUMN "almaId" TO "catalogId";
ALTER TABLE "BibEntry" RENAME COLUMN "almaIdType" TO "catalogIdType";

-- Add the catalog column with a default value
ALTER TABLE "BibEntry" ADD COLUMN "catalog" "Catalog" NOT NULL DEFAULT 'ALMA';
