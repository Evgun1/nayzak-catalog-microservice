import { Type } from "class-transformer";
import { IsArray, IsInt, IsNumber } from "class-validator";

export class ValidationProductsKafkaRatingPayloadDTO {
	@Type(() => Number)
	@IsInt()
	rating: number;

	@Type(() => Number)
	@IsInt()
	productsId: number;
}

export class ValidationProductsKafkaPayloadDTO {
	@IsArray()
	@IsNumber({}, { each: true })
	productsId: number[];
}
