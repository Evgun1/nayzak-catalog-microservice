/*
  Warnings:

  - A unique constraint covering the columns `[type]` on the table `AttributeDefinitions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AttributeDefinitions_type_key" ON "AttributeDefinitions"("type");
