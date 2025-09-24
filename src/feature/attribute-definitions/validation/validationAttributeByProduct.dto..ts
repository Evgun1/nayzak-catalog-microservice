import { Type } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";

export class ValidationAttributeByProductParamDTO {
	@IsNotEmpty()
	@Type(() => Number)
	@IsInt()
	productId: number;
}
