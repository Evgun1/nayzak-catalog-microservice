import { Type } from "class-transformer";
import {
	ArrayMinSize,
	IsArray,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	ValidateNested,
} from "class-validator";

export class ValidationAttributeUploadBodyDTO {
	@IsNotEmpty()
	@IsString()
	name: string;
	@IsNotEmpty()
	@IsString()
	type: string;

	@IsNotEmpty()
	@IsInt()
	@Type(() => Number)
	subcategoriesId: number;

	@IsString()
	@IsOptional()
	unit?: string;
}

export class ValidationAttributeUploadManyBodyDTO {
	@IsArray()
	@ValidateNested({ each: true })
	@ArrayMinSize(1)
	@Type(() => ValidationAttributeUploadBodyDTO)
	attributes: ValidationAttributeUploadBodyDTO[];
}
