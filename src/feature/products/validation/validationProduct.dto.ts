import { Type } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";

export class ValidationProductParamDTO {
	@IsNotEmpty()
	@IsInt()
	@Type(() => Number)
	id: number;
}
