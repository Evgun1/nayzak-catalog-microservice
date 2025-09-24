import { Controller, Module } from "@nestjs/common";
import { FakerService } from "./faker.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { ProductsModule } from "src/feature/products/products.module";
import { CategoriesModule } from "src/feature/categories/categories.module";
import { MediaModule } from "src/feature/media/media.module";
import { SubcategoriesModule } from "src/feature/subcategories/subcategories.module";
import { ValidationAttributeUploadManyBodyDTO } from "src/feature/attribute-definitions/validation/validationAttributeUpload.dto";
import { AttributeDefinitionsModule } from "src/feature/attribute-definitions/attributeDefinitions.module";

@Module({
	imports: [
		PrismaModule,
		ProductsModule,
		CategoriesModule,
		MediaModule,
		SubcategoriesModule,
		AttributeDefinitionsModule,
	],
	providers: [FakerService],
	exports: [FakerService],
})
export class FakerModule {}
