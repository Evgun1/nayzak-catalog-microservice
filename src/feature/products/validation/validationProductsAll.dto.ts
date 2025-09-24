import { PartialType } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsArray, IsInt, IsNumber, IsOptional } from "class-validator";
import { ValidationQueryDTO } from "src/query/validation/validationQuery.dto";

export class ValidationProductsAllQueryDTO extends PartialType(
	ValidationQueryDTO,
) {
	@IsOptional()
	@IsArray()
	@Transform(({ value }) => (value as string).split(",").map((item) => +item))
	@IsNumber({}, { each: true })
	productsId?: number[];

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	categoryId?: number;

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	subcategoryId?: number;

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	minPrice?: number;

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	maxPrice?: number;
}
