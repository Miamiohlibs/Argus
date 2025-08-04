-- CreateTable
CREATE TABLE "PullList" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "PullList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BibEntry" (
    "id" TEXT NOT NULL,
    "itemTitle" TEXT NOT NULL,
    "almaId" TEXT NOT NULL,
    "almaIdType" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "callNumber" TEXT,
    "location" TEXT NOT NULL,
    "notes" TEXT,

    CONSTRAINT "BibEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemEntry" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "bibEntryId" TEXT,

    CONSTRAINT "ItemEntry_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PullList" ADD CONSTRAINT "PullList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemEntry" ADD CONSTRAINT "ItemEntry_bibEntryId_fkey" FOREIGN KEY ("bibEntryId") REFERENCES "BibEntry"("id") ON DELETE SET NULL ON UPDATE CASCADE;
