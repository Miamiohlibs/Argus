/*
  Warnings:

  - You are about to drop the column `almaId` on the `BibEntry` table. All the data in the column will be lost.
  - You are about to drop the column `almaIdType` on the `BibEntry` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Catalog" AS ENUM ('ALMA', 'ASPACE');

-- AlterTable
ALTER TABLE "BibEntry" DROP COLUMN "almaId",
DROP COLUMN "almaIdType",
ADD COLUMN     "catalog" "Catalog" NOT NULL DEFAULT 'ALMA',
ADD COLUMN     "catalogId" TEXT,
ADD COLUMN     "catalogIdType" TEXT;
