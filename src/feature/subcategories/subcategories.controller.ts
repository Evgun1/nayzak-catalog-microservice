import {
	Controller,
	Get,
	Param,
	Query,
	Res,
	UsePipes,
	ValidationPipe,
} from "@nestjs/common";
import { SubcategoriesService } from "./subcategories.service";
import { ValidationSubcategoryParamDTO } from "./validation/validationSubcategory.dto";
import { ValidationSubcategoriesQueryDTO } from "./validation/validationSubcategories.dto";
import { Response } from "express";
import { ValidationQueryDTO } from "src/query/validation/validationQuery.dto";
import { ValidationSubcategoriesByCategoryParamDTO } from "./validation/validationnSubcategoryByCategory.dto";

@Controller("subcategories")
export class SubcategoriesControllers {
	constructor(private readonly subcategoriesService: SubcategoriesService) {}

	@Get("/")
	async getSubcategories(
		@Query() query: ValidationQueryDTO & ValidationSubcategoriesQueryDTO,
		@Res({ passthrough: true }) res: Response,
	) {
		const { subcategories, totalCount } =
			await this.subcategoriesService.getSubcategories(query);

		res.setHeader("X-Total-Count", totalCount);
		return subcategories;
	}

	@Get("/:param")
	@UsePipes(new ValidationPipe({ transform: true }))
	async getSubcategory(@Param() params: ValidationSubcategoryParamDTO) {
		const subcategories =
			await this.subcategoriesService.getSubcategory(params);

		return subcategories;
	}
	@Get("category/:id")
	async getSubcategoryByCategory(
		@Param() param: ValidationSubcategoriesByCategoryParamDTO,
		@Res({ passthrough: true }) res: Response,
	) {
		try {
			const { subcategories, totalCount } =
				await this.subcategoriesService.getSubcategoryByCategory(param);

			res.setHeader("X-Total-Count", totalCount);
			return subcategories;
		} catch (error) {
			console.log(error);
		}
	}
}
