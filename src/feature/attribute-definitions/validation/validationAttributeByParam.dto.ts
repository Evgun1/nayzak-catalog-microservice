import { Transform, Type } from "class-transformer";
import { PickType } from "@nestjs/swagger";

import {
	IsArray,
	IsInt,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	ValidateNested,
} from "class-validator";
import { ValidationProductsAllQueryDTO } from "src/feature/products/validation/validationProductsAll.dto";

export class ValidationAttributeByParamParamDTO {
	@IsNotEmpty()
	@Type(() => Number)
	@IsInt()
	subcategoryId: number;
}
export class ValidationAttributeByParamQueryDTO extends PickType(
	ValidationProductsAllQueryDTO,
	["maxPrice", "minPrice"],
) {
	@IsOptional()
	@Transform(({ value }) => (value as string).split(",").map(Number))
	@IsArray()
	@IsNumber({}, { each: true })
	color?: number[];
	@IsOptional()
	@Transform(({ value }) => (value as string).split(",").map(Number))
	@IsArray()
	@IsNumber({}, { each: true })
	manufacturer?: number[];
	@IsOptional()
	@Transform(({ value }) => (value as string).split(",").map(Number))
	@IsArray()
	@IsNumber({}, { each: true })
	material?: number[];
}
