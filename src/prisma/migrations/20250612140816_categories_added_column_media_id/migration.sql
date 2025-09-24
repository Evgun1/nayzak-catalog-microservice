-- AlterTable
ALTER TABLE "Categories" ADD COLUMN     "mediaId" INTEGER;

-- AddForeignKey
ALTER TABLE "Categories" ADD CONSTRAINT "Categories_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
