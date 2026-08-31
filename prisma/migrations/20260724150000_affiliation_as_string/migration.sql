-- AlterTable
ALTER TABLE "User" ALTER COLUMN "affiliation" TYPE TEXT USING "affiliation"::TEXT;
ALTER TABLE "Project" ALTER COLUMN "patronAffiliation" TYPE TEXT USING "patronAffiliation"::TEXT;

-- DropEnum
DROP TYPE "UserAffiliation";
