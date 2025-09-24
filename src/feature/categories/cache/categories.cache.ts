import { CategoriesCacheParam } from "./interface/categoriesGapDto.interface";
import { RedisService } from "src/redis/redis.service";

import { CategoryCacheDTO } from "./dto/categoriesGapCache.dto";

export class CategoriesCache {
	cacheKeyCategoriesGap = "categories";

	constructor(private readonly redis: RedisService) {}

	async getCategories() {
		const cacheCategoriesGap = await this.redis.hGetAll<CategoryCacheDTO>(
			this.cacheKeyCategoriesGap,
		);
		return cacheCategoriesGap.map((data) => Object.values(data)[0]);
	}

	async uploadCategoriesCache(param: CategoriesCacheParam[]) {
		const cacheCategoriesGap = await this.getCategories();

		for (const element of param) {
			const findCache = cacheCategoriesGap.find(
				(category) => category.id === element.id,
			);
			if (findCache) continue;

			await this.redis.hSet(this.cacheKeyCategoriesGap, {
				[element.id.toString()]: element,
			});
		}
	}

	async updateCategoriesGap(param: CategoriesCacheParam[]) {
		const cacheCategoriesGap = await this.getCategories();
		for (const element of param) {
			const findCache = cacheCategoriesGap.find(
				(category) => category.id === element.id,
			);
			if (!findCache) continue;

			await this.redis.hSet(this.cacheKeyCategoriesGap, {
				[element.id.toString()]: element,
			});
		}
	}
	async deleteCategories(id: number[] | number) {
		await this.redis.hDel(this.cacheKeyCategoriesGap, id);
	}
}
