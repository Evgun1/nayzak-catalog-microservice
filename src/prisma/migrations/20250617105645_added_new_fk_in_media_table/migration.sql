/*
  Warnings:

  - You are about to drop the column `mediaId` on the `Products` table. All the data in the column will be lost.
  - Added the required column `categoriesId` to the `Media` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productsId` to the `Media` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Products" DROP CONSTRAINT "Products_mediaId_fkey";

-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "categoriesId" INTEGER NOT NULL,
ADD COLUMN     "productsId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Products" DROP COLUMN "mediaId";

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_productsId_fkey" FOREIGN KEY ("productsId") REFERENCES "Products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
