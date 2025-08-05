/*
  Warnings:

  - You are about to drop the `PullList` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `projectId` to the `BibEntry` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."PullList" DROP CONSTRAINT "PullList_userId_fkey";

-- AlterTable
ALTER TABLE "public"."BibEntry" ADD COLUMN     "projectId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "public"."PullList";

-- CreateTable
CREATE TABLE "public"."Project" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "notes" TEXT,
    "needForDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Project" ADD CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("clerkUserId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BibEntry" ADD CONSTRAINT "BibEntry_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
