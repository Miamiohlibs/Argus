-- DropForeignKey
ALTER TABLE "public"."ItemEntry" DROP CONSTRAINT "ItemEntry_bibEntryId_fkey";

-- AddForeignKey
ALTER TABLE "public"."ItemEntry" ADD CONSTRAINT "ItemEntry_bibEntryId_fkey" FOREIGN KEY ("bibEntryId") REFERENCES "public"."BibEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
