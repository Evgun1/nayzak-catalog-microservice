import { QueryService } from "src/query/query.service";
import { Prisma } from "@prisma/client";
import { ValidationCategoryParamParamDTO } from "./validation/validationCategoryByParam.dto";
import { Injectable } from "@nestjs/common";
import { ValidationQueryDTO } from "src/query/validation/validationQuery.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { promises } from "dns";
import { ValidationCategoriesUploadDTO } from "./validation/validationCategoriesUpload.dto";
import { CategoriesCache } from "./cache/categories.cache";
import { RedisService } from "src/redis/redis.service";
import { CategoryCacheDTO } from "./cache/dto/categoriesGapCache.dto";
import { CategoryDTO } from "./dto/category.dto";
import { ClientApiService } from "src/client-api/clientApi.service";

@Injectable()
export class CategoriesService {
	categoriesCache: CategoriesCache;

	constructor(
		private readonly redis: RedisService,
		private readonly prisma: PrismaService,
		private readonly queryService: QueryService,
		private readonly clientApi: ClientApiService,
	) {
		this.categoriesCache = new CategoriesCache(redis);
	}

	async getCategoriesAll() {
		const categoriesCache = await this.categoriesCache.getCategories();

		if (categoriesCache.length > 0) {
			return {
				categories: categoriesCache,
				categoriesCount: categoriesCache.length,
			};
		}

		const categories = await this.prisma.categories.findMany({
			include: { Media: { select: { src: true, name: true } } },
		});

		const categoriesCount = await this.prisma.categories.count({});

		const categoriesDTO: CategoryDTO[] = categories.map((category) => {
			const { Media, id, title } = category;

			return new CategoryDTO({
				id,
				title,
				Media: Media[0],
			});
		});

		await this.categoriesCache.uploadCategoriesCache(categoriesDTO);
		console.log(categories, true);

		return { categoriesCount, categories: categoriesDTO };
	}
	async getCategory({ param }: ValidationCategoryParamParamDTO) {
		const args: Prisma.CategoriesFindFirstArgs = {};

		if (!Number.isNaN(+param)) {
			args.where = { id: +param };
		} else {
			args.where = { title: { equals: param, mode: "insensitive" } };
		}

		const category = await this.prisma.categories.findFirst(args);
		return category;
	}

	async uploadCategories(body: ValidationCategoriesUploadDTO) {
		const categories = await this.prisma.categories.create({
			data: { title: body.title },
			include: { Media: { select: { src: true, name: true } } },
			// select: { id: true, title: true, Media: { select: { src: true } } },
		});

		const media = categories.Media.map((media) => ({
			src: media.src,
			name: media.name,
		}));

		const categoriesGapDTO = new CategoryCacheDTO({
			id: categories.id,
			title: categories.title,
			Media: media[0],
		});

		this.clientApi.clearCache("categories");
		await this.categoriesCache.uploadCategoriesCache([categoriesGapDTO]);
		return categories;
	}
}
