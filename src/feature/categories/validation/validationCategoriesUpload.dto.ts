import { Type } from "class-transformer";
import { IsInt, IsString } from "class-validator";

export class ValidationCategoriesUploadDTO {
	@IsString()
	@Type(() => String)
	title: string;
}
