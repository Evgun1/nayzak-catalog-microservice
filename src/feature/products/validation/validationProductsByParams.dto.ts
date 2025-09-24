import { IntersectionType, PartialType, PickType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";
import { ValidationAttributeByParamQueryDTO } from "src/feature/attribute-definitions/validation/validationAttributeByParam.dto";
import { ValidationQueryDTO } from "src/query/validation/validationQuery.dto";

class ValidationProductsByParamsParamDTO {
	@IsNotEmpty()
	@Type(() => Number)
	@IsInt()
	categoryId: number;

	@IsNotEmpty()
	@Type(() => Number)
	@IsInt()
	subcategoryId: number;
}

class ValidationProductsByParamsQueryDTO extends IntersectionType(
	ValidationAttributeByParamQueryDTO,
	ValidationQueryDTO,
) {}

export {
	ValidationProductsByParamsParamDTO,
	ValidationProductsByParamsQueryDTO,
};
