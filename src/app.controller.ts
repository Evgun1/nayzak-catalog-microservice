import {
	Body,
	Controller,
	Get,
	Post,
	UploadedFile,
	UploadedFiles,
	UseInterceptors,
	ValidationPipe,
} from "@nestjs/common";
import { AppService } from "./app.service";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { CloudinaryService } from "./cloudinary/cloudinary.service";
import { FakerService } from "./tools/fake/faker.service";
import { faker } from "@faker-js/faker";
import { buffer } from "stream/consumers";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { ProductsKafkaDTO } from "./feature/products/dto/productsKafka.dto";
import { validationExceptionFactory } from "./utils/validationExceptionFactory";
import { ValidationProductsKafkaPayloadDTO } from "./feature/products/validation/validationProductsKafka.dto";

@Controller("/")
export class AppController {
	constructor(
		private readonly cloudinaryService: CloudinaryService,
		private readonly fakerService: FakerService,
	) {}

	@Post("")
	@UseInterceptors(FilesInterceptor("files"))
	async test(
		@UploadedFiles() file: Array<Express.Multer.File>,
		@Body() body: any,
	) {}

	// @MessagePattern("get.products")
	// async getProductCatalog(
	// 	@Payload(
	// 		new ValidationPipe({
	// 			exceptionFactory: validationExceptionFactory,
	// 		}),
	// 	)
	// 	payload: ValidationProductsKafkaPayloadDTO,
	// ) {

	// 	return payload;
	// 	// const productsKafka = await this.productsService.productsKafka(payload);
	// 	// return productsKafka;
	// }
}
