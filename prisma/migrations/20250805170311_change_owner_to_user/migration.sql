-- DropForeignKey
ALTER TABLE "PullList" DROP CONSTRAINT "PullList_userId_fkey";

-- AddForeignKey
ALTER TABLE "PullList" ADD CONSTRAINT "PullList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("clerkUserId") ON DELETE CASCADE ON UPDATE CASCADE;
