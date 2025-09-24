import { Type } from "class-transformer";
import {
	IsDefined,
	IsInt,
	IsNotEmpty,
	IsNotEmptyObject,
	IsObject,
	IsOptional,
	IsString,
	MinLength,
	ValidateNested,
} from "class-validator";

class MultiLanguageDTO {
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	subcategoriesId?: number;
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	categoriesId?: number;
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	productsId?: number;
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	customersId?: number;
}

export class ValidationMediaUploadDTO {
	@IsString()
	@IsNotEmpty()
	@MinLength(4)
	name: string;

	@IsDefined()
	@IsNotEmptyObject()
	@IsObject()
	@ValidateNested()
	@Type(() => MultiLanguageDTO)
	dataId: MultiLanguageDTO;
}
