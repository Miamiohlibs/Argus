-- CreateEnum
CREATE TYPE "public"."UserAffiliation" AS ENUM ('Miami', 'Other');

-- CreateEnum
CREATE TYPE "public"."UserStatus" AS ENUM ('Undergrad', 'Graduate', 'Faculty', 'Staff', 'Alumni', 'Other');

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "affiliation" "public"."UserAffiliation",
ADD COLUMN     "status" "public"."UserStatus";
