/*
  Warnings:

  - You are about to drop the column `libStaff` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "libStaff",
ADD COLUMN     "printSlips" BOOLEAN NOT NULL DEFAULT false;
