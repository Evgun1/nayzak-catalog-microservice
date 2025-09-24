/*
  Warnings:

  - You are about to drop the column `mediaId` on the `Categories` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Categories" DROP CONSTRAINT "Categories_mediaId_fkey";

-- AlterTable
ALTER TABLE "Categories" DROP COLUMN "mediaId";

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_categoriesId_fkey" FOREIGN KEY ("categoriesId") REFERENCES "Categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
