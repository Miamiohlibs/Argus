-- CreateTable
CREATE TABLE "public"."_ProjectCoEditors" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProjectCoEditors_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ProjectCoEditors_B_index" ON "public"."_ProjectCoEditors"("B");

-- AddForeignKey
ALTER TABLE "public"."_ProjectCoEditors" ADD CONSTRAINT "_ProjectCoEditors_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ProjectCoEditors" ADD CONSTRAINT "_ProjectCoEditors_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
