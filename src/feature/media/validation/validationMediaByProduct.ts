import { Type } from "class-transformer";
import { IsNumber } from "class-validator";

export class ValidationMEdiaByProductParam {
	@Type(() => Number)
	@IsNumber()
	productId: number;
}
