import { Injectable } from "@nestjs/common";
import { ValidationSubcategoryParamDTO } from "./validation/validationSubcategory.dto";
import { ValidationSubcategoriesQueryDTO } from "./validation/validationSubcategories.dto";
import { Prisma } from "@prisma/client";
import { ValidationQueryDTO } from "src/query/validation/validationQuery.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { QueryService } from "src/query/query.service";
import { th } from "@faker-js/faker/.";
import { ValidationSubcategoriesByCategoryParamDTO } from "./validation/validationnSubcategoryByCategory.dto";

@Injectable()
export class SubcategoriesService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly queryService: QueryService,
	) {}

	async getSubcategories(
		query: ValidationQueryDTO & ValidationSubcategoriesQueryDTO,
	) {
		const getQuery = this.queryService.getQuery("Subcategories", query);

		const options: Prisma.SubcategoriesFindManyArgs = {
			...getQuery,
		};

		if (query.categoryId) {
			options.where = {
				categoriesId: +query.categoryId,
			};
		}

		const subcategories = await this.prisma.subcategories.findMany(options);

		const totalCount = await this.prisma.subcategories.count({
			where: options.where,
		});

		return { subcategories, totalCount };
	}

	async getSubcategory({ param }: ValidationSubcategoryParamDTO) {
		const where: Prisma.SubcategoriesWhereInput = {};

		if (!Number.isNaN(+param)) {
			where.id = +param;
		} else {
			where.title = { equals: param, mode: "insensitive" };
		}

		const subcategory = await this.prisma.subcategories.findFirst({
			where,
		});

		return subcategory;
	}

	async getSubcategoryByCategory({
		id,
	}: ValidationSubcategoriesByCategoryParamDTO) {
		const subcategories = await this.prisma.subcategories.findMany({
			include: { Media: { select: { name: true, src: true } } },
			where: { categoriesId: id },
		});

		const totalCount = await this.prisma.subcategories.count({
			where: { categoriesId: id },
		});

		return { subcategories, totalCount };
	}
}
