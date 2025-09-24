import { $Enums } from "@prisma/client";
import { Type } from "class-transformer";
import {
	IsIn,
	IsInt,
	IsOptional,
	IsString,
	Matches,
	Max,
	Min,
	MinLength,
} from "class-validator";

export class ValidationUploadProductBodyDTO {
	@IsString()
	@MinLength(10, { message: "Title less than ten words" })
	@Matches(/[A-Z]/, { message: "Title must contain one capital letter" })
	@Matches(
		/^[^`!@#$%^&*+\-=\[\]{};':"\\|,.<>\/?~]*[^`!@#$%^&*+\-=\[\]{};':"\\|,.<>\/?~]$/,
		{
			message:
				"Title cannot contain symbols: .-() at the beginning or end of a line",
		},
	)
	@Matches(/^[^`!@#$%^&*_+=\[\]{};':"\\|,<>\/?~]*$/, {
		message: "Should not have symbols: !@#$%^&*_+=[]{};':\"|,<>/?~",
	})
	title: string;

	@IsString()
	@MinLength(20, { message: "Description less than twenty words" })
	@Matches(/[A-Z]/, {
		message: "Description must contain one capital letter",
	})
	@Matches(
		/^[^`!@#$%^&*+\-=\[\]{};':"\\|,.<>\/?~]*[^`!@#$%^&*+\-=\[\]{};':"\\|,.<>\/?~]$/,
		{
			message:
				"Description cannot contain symbols: () at the beginning or end of a line",
		},
	)
	@Matches(/^[^`!@#$%^&*_()+=\[\]{};':"\\|,<>\/?~]*$/, {
		message: "Should not have symbols: !@#$%^&*()_+=[]{};':|,<>/?~",
	})
	description: string;

	@Type(() => Number)
	@IsInt({ message: "Price must be an integer" })
	@Min(1, { message: "Price must be a positive number" })
	price: number;

	@IsString()
	@IsIn(["outOfStock", "inStock", "discontinued"], {
		message: 'Must be "in stock", "out of stock", "disable"',
	})
	status: $Enums.ProductsStatus;

	@IsOptional()
	@Max(100, { message: "Discount should not exceed 100" })
	discount?: number;

	@Type(() => Number)
	@IsInt({ message: "categoriesId must be an integer" })
	@Min(1, { message: "categoriesId must be a positive number" })
	categoriesId: number;

	@Type(() => Number)
	@IsInt({ message: "subcategoriesId must be an integer" })
	@Min(1, { message: "subcategoriesId must be a positive number" })
	subcategoriesId: number;
}
