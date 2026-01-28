/*
  Warnings:

  - You are about to drop the column `subject` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "subject",
ADD COLUMN     "subjects" TEXT[];
