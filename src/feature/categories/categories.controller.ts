import {
	Controller,
	Get,
	Param,
	Query,
	Res,
	UsePipes,
	ValidationPipe,
} from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { ValidationCategoryParamParamDTO } from "./validation/validationCategoryByParam.dto";
import { Transform } from "class-transformer";
import { Response } from "express";
import { ValidationQueryDTO } from "src/query/validation/validationQuery.dto";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { validationExceptionFactory } from "src/utils/validationExceptionFactory";

@Controller("categories")
export class CategoriesController {
	constructor(private readonly categoriesService: CategoriesService) {}
	@Get()
	async getCategoriesAll(
		@Query() query: ValidationQueryDTO,
		@Res({ passthrough: true }) res: Response,
	) {
		const { categories, categoriesCount } =
			await this.categoriesService.getCategoriesAll();

		res.setHeader("X-Total-Count", categoriesCount.toString());
		return categories;
	}

	@Get("/:param")
	async getCategory(@Param() params: ValidationCategoryParamParamDTO) {
		const categories = await this.categoriesService.getCategory(params);

		return categories;
	}
}
