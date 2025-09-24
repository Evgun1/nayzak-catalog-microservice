-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "subcategoriesId" INTEGER;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_subcategoriesId_fkey" FOREIGN KEY ("subcategoriesId") REFERENCES "Subcategories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
