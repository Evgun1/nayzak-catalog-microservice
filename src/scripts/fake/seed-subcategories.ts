import { NestFactory } from "@nestjs/core";
import { AppModule } from "src/app.module";
import { FakerService } from "src/tools/fake/faker.service";

export async function bootstrapSubcategories() {
	const app = await NestFactory.createApplicationContext(AppModule);
	const faker = app.get(FakerService);

	await faker.generateSubcategoriesFaker();
	await app.close();
}
bootstrapSubcategories();
