import { NestFactory } from "@nestjs/core";
import { AppModule } from "src/app.module";
import { FakerService } from "src/tools/fake/faker.service";
import { bootstrapMedia } from "./seed-media";
import { bootstrapCategories } from "./seed-categories";
import { bootstrapSubcategories } from "./seed-subcategories";
import { bootstrapProducts } from "./seed-products";

async function bootstrap() {
	const app = await NestFactory.createApplicationContext(AppModule);
	const faker = app.get(FakerService);
	await faker.generateCategoriesFaker();
	await faker.generateSubcategoriesFaker();
	await faker.generateProductsFaker();
	await faker.generateAttributeFaker();
	await faker.generateMediaFaker();
	await app.close();
}
bootstrap();
