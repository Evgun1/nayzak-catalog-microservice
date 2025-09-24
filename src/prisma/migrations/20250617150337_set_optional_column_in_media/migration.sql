/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Media` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Media` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Media` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_categoriesId_fkey";

-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_productsId_fkey";

-- AlterTable
ALTER TABLE "Media" DROP COLUMN "createdAt",
DROP COLUMN "description",
DROP COLUMN "updatedAt",
ALTER COLUMN "customersId" DROP NOT NULL,
ALTER COLUMN "categoriesId" DROP NOT NULL,
ALTER COLUMN "productsId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_productsId_fkey" FOREIGN KEY ("productsId") REFERENCES "Products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_categoriesId_fkey" FOREIGN KEY ("categoriesId") REFERENCES "Categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
