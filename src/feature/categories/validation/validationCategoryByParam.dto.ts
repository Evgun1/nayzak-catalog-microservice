import { Transform, Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class ValidationCategoryParamParamDTO {
	@IsNotEmpty()
	param: any;
}
