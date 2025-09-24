/*
  Warnings:

  - A unique constraint covering the columns `[subcategoriesId,type]` on the table `AttributeDefinitions` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "AttributeDefinitions_type_key";

-- CreateIndex
CREATE UNIQUE INDEX "AttributeDefinitions_subcategoriesId_type_key" ON "AttributeDefinitions"("subcategoriesId", "type");
