import { Transform, Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional, IsString, Min } from "class-validator";

export class ValidationQueryDTO {
	@IsOptional()
	@IsString()
	search?: string;
	@IsOptional()
	@IsString()
	searchBy?: string;

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	@Transform(({ value }) => Number(value))
	page?: number;

	@IsOptional()
	@IsString()
	filter?: string;

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(0)
	@Transform(({ value }) => Number(value))
	limit?: number;

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Transform(({ value }) => Number(value))
	offset?: number;

	@IsOptional()
	@Transform(({ value }) => value?.toUpperCase())
	@IsEnum(["ASC", "DESC"], {
		message: "sort must be either asc or desc",
	})
	@IsString()
	sort?: "ASC" | "DESC";

	@IsOptional()
	@IsString()
	sortBy?: string;
}
