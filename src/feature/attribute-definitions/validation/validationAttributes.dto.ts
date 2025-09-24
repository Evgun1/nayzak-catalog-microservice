import { PartialType } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsArray, IsInt, IsNumber, IsOptional } from "class-validator";
import { ValidationQueryDTO } from "src/query/validation/validationQuery.dto";

export class ValidationAttributesQueryDTO extends PartialType(
	ValidationQueryDTO,
) {
	@IsOptional()
	@Transform(({ value }) => (value as string).split(",").map((i) => +i))
	@Type(() => Array<Number>)
	@IsArray()
	@IsNumber({}, { each: true })
	color?: number[];

	@IsOptional()
	@Transform(({ value }) => (value as string).split(",").map((i) => +i))
	@Type(() => Array<Number>)
	@IsArray()
	@IsNumber({}, { each: true })
	material?: number[];

	@IsOptional()
	@Transform(({ value }) => (value as string).split(",").map((i) => +i))
	@Type(() => Array<Number>)
	@IsArray()
	@IsNumber({}, { each: true })
	manufacturer?: number[];
}
