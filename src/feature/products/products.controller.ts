import {
	Controller,
	Get,
	Param,
	Query,
	Res,
	UsePipes,
	ValidationPipe,
} from "@nestjs/common";
import {
	EventPattern,
	MessagePattern,
	Payload,
	Transport,
} from "@nestjs/microservices";
import { ProductsService } from "./products.service";

import { Response } from "express";

import {
	ValidationProductsKafkaPayloadDTO,
	ValidationProductsKafkaRatingPayloadDTO,
} from "./validation/validationProductsKafka.dto";
import { validationExceptionFactory } from "src/utils/validationExceptionFactory";
import { ValidationMinMaxPriceParamDTO } from "./validation/validationMinMaxPice.dto";
import { ValidationProductParamDTO } from "./validation/validationProduct.dto";
import {
	ValidationProductsByParamsParamDTO,
	ValidationProductsByParamsQueryDTO,
} from "./validation/validationProductsByParams.dto";
import { ValidationProductsAllQueryDTO } from "./validation/validationProductsAll.dto";
import { ProductsKafkaDTO } from "./dto/productsKafka.dto";

@Controller("products")
export class ProductsController {
	constructor(private readonly productsService: ProductsService) {}

	@Get()
	async getProductsAll(
		@Query() query: ValidationProductsAllQueryDTO,
		@Res({ passthrough: true }) res: Response,
	) {
		const { productCounts, products } =
			await this.productsService.getProductsAll(query);

		console.log(query);

		res.setHeader("X-Total-Count", productCounts);
		res.setHeader("Access-Control-Expose-Headers", "X-Total-Count");

		return products;
	}

	@Get("new-products")
	async getNewProducts() {
		const newProducts = await this.productsService.getNewProducts();
		return newProducts;
	}

	@Get("by-params/:categoryId/:subcategoryId")
	async getProductsByParams(
		@Param() param: ValidationProductsByParamsParamDTO,
		@Query() query: ValidationProductsByParamsQueryDTO,
		@Res({ passthrough: true }) res: Response,
	) {
		const { productCounts, products } =
			await this.productsService.getProductsAll({ ...param, ...query });

		res.setHeader("X-Total-Count", productCounts.toString());
		return products;
	}

	@Get("/:id")
	async getProduct(@Param() param: ValidationProductParamDTO) {
		const product = await this.productsService.getProduct(param);

		return { ...product };
	}

	@Get("min-max-price/:categoryId/:subcategoryId")
	async getMinMaxPrice(@Param() params: ValidationMinMaxPriceParamDTO) {
		const { minPrice, maxPrice } =
			await this.productsService.getMinMaxPrice(params);

		return { minPrice, maxPrice };
	}

	@MessagePattern("update.product.rating")
	async updateRatingProduct(
		@Payload(
			new ValidationPipe({
				exceptionFactory: validationExceptionFactory,
			}),
		)
		payload: ValidationProductsKafkaRatingPayloadDTO,
	) {
		console.log(payload);

		await this.productsService.updateProduct({
			id: payload.productsId,
			rating: payload.rating,
		});
	}

	@MessagePattern("get.products.catalog", Transport.KAFKA)
	async getProductCatalog(
		@Payload(
			new ValidationPipe({
				exceptionFactory: validationExceptionFactory,
			}),
		)
		payload: ValidationProductsKafkaPayloadDTO,
	) {
		const productsKafka = await this.productsService.productsKafka(payload);

		return productsKafka;
	}
}
