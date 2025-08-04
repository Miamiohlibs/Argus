-- AlterTable
ALTER TABLE "PullList" ADD COLUMN     "needForDate" TIMESTAMP(3),
ADD COLUMN     "notes" TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'user';
