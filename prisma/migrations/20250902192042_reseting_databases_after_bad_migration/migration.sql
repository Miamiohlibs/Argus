-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('user', 'editor', 'admin', 'superadmin');

-- CreateEnum
CREATE TYPE "public"."UserAffiliation" AS ENUM ('Miami', 'Other');

-- CreateEnum
CREATE TYPE "public"."UserStatus" AS ENUM ('Undergrad', 'Graduate', 'Faculty', 'Staff', 'Alumni', 'Other');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'user',
    "affiliation" "public"."UserAffiliation",
    "status" "public"."UserStatus",
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "public"."BibEntry" (
    "id" TEXT NOT NULL,
    "itemTitle" TEXT NOT NULL,
    "almaId" TEXT NOT NULL,
    "almaIdType" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "pub_date" TEXT,
    "publisher" TEXT,
    "callNumber" TEXT,
    "location" TEXT NOT NULL,
    "notes" TEXT,
    "totalItems" INTEGER DEFAULT 1,
    "url" TEXT,
    "projectId" INTEGER NOT NULL,

    CONSTRAINT "BibEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ItemEntry" (
    "id" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "call_number" TEXT,
    "copy_id" TEXT,
    "barcode" TEXT,
    "bibEntryId" TEXT,

    CONSTRAINT "ItemEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Transaction" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkUserId_key" ON "public"."User"("clerkUserId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "Transaction_userId_idx" ON "public"."Transaction"("userId");

-- AddForeignKey
ALTER TABLE "public"."Project" ADD CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("clerkUserId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BibEntry" ADD CONSTRAINT "BibEntry_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ItemEntry" ADD CONSTRAINT "ItemEntry_bibEntryId_fkey" FOREIGN KEY ("bibEntryId") REFERENCES "public"."BibEntry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("clerkUserId") ON DELETE CASCADE ON UPDATE CASCADE;
