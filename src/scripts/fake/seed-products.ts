import { NestFactory } from "@nestjs/core";
import { AppModule } from "src/app.module";
import { FakerService } from "src/tools/fake/faker.service";

export async function bootstrapProducts() {
	const app = await NestFactory.createApplicationContext(AppModule);
	const faker = app.get(FakerService);
	await faker.generateProductsFaker();
	await app.close();
}
bootstrapProducts();
