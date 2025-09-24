import { Module } from "@nestjs/common";
import { ProductsModule } from "./feature/products/products.module";
import { ConfigModule } from "@nestjs/config";
import { CategoriesModule } from "./feature/categories/categories.module";
import { SubcategoriesModule } from "./feature/subcategories/subcategories.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaModule } from "./prisma/prisma.module";
import { RedisModule } from "./redis/redis.module";
import { FakerModule } from "./tools/fake/faker.module";
import { MediaModule } from "./feature/media/media.module";
import { AttributeDefinitionsModule } from "./feature/attribute-definitions/attributeDefinitions.module";
import { CloudinaryModule } from "./cloudinary/cloudinary.module";

@Module({
	imports: [
		CloudinaryModule,
		FakerModule,
		MediaModule,
		ProductsModule,
		CategoriesModule,
		SubcategoriesModule,
		PrismaModule,
		RedisModule,
		AttributeDefinitionsModule,
		ConfigModule.forRoot({
			isGlobal: true,
		}),
	],

	controllers: [AppController],
	providers: [AppService],
	exports: [AppService],
})
export class AppModule {}
