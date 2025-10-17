/*
  Warnings:

  - You are about to drop the column `location` on the `BibEntry` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `ItemEntry` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."BibEntry" DROP COLUMN "location";

-- AlterTable
ALTER TABLE "public"."ItemEntry" DROP COLUMN "location";
