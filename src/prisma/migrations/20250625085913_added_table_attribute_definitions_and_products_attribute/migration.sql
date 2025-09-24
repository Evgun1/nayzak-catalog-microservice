-- CreateTable
CREATE TABLE "AttributeDefinitions" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "unit" TEXT,
    "subcategoriesId" INTEGER NOT NULL,

    CONSTRAINT "AttributeDefinitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductsAttribute" (
    "id" SERIAL NOT NULL,
    "attributeDefinitionsId" INTEGER NOT NULL,
    "productsId" INTEGER,

    CONSTRAINT "ProductsAttribute_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AttributeDefinitions" ADD CONSTRAINT "AttributeDefinitions_subcategoriesId_fkey" FOREIGN KEY ("subcategoriesId") REFERENCES "Subcategories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductsAttribute" ADD CONSTRAINT "ProductsAttribute_attributeDefinitionsId_fkey" FOREIGN KEY ("attributeDefinitionsId") REFERENCES "AttributeDefinitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductsAttribute" ADD CONSTRAINT "ProductsAttribute_productsId_fkey" FOREIGN KEY ("productsId") REFERENCES "Products"("id") ON DELETE SET NULL ON UPDATE CASCADE;
