-- AlterTable
ALTER TABLE "public"."BibEntry" ADD COLUMN     "location_codes" TEXT,
ADD COLUMN     "location_display" TEXT,
ALTER COLUMN "almaId" DROP NOT NULL,
ALTER COLUMN "almaIdType" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."ItemEntry" ADD COLUMN     "location_code" TEXT,
ADD COLUMN     "location_name" TEXT;
