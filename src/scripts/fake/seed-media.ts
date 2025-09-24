import { NestFactory } from "@nestjs/core";
import { AppModule } from "../../app.module";
import { FakerService } from "src/tools/fake/faker.service";

export async function bootstrapMedia() {
	const app = await NestFactory.createApplicationContext(AppModule);
	const faker = app.get(FakerService);
	await faker.generateMediaFaker();

	await app.close();
}

bootstrapMedia();
