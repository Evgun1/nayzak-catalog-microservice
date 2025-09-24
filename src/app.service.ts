import { Injectable } from "@nestjs/common";
import { Interval } from "@nestjs/schedule";
import { RedisService } from "./redis/redis.service";
import { CategoriesCache } from "./feature/categories/cache/categories.cache";
import { ProductsCache } from "./feature/products/cache/products.cache";
@Injectable()
export class AppService {
	categoriesCache: CategoriesCache;
	productsCache: ProductsCache;

	constructor(private readonly redis: RedisService) {
		this.categoriesCache = new CategoriesCache(redis);
		this.productsCache = new ProductsCache(redis);
	}

	@Interval(35e6)
	async tenHours() {
		const cacheCategories = await this.categoriesCache.getCategories();
		const curDate = Date.now();
		for (const element of cacheCategories) {
			const cacheHours = element.createdCacheAt.getTime();

			const hoursPassed = (cacheHours - cacheHours) / (1000 * 60 * 60);

			if (hoursPassed >= 10) {
				await this.categoriesCache.deleteCategories(element.id);
			}
		}
	}

	@Interval(6e5)
	async thirtyMin() {
		const cacheProduct = await this.productsCache.getCacheNewProducts();
		const curDate = Date.now();

		for (const element of cacheProduct) {
			const cacheDate = element.createdCacheAt.getTime();
			const passedMin = (curDate - cacheDate) / (1000 * 60);

			if (passedMin >= 10) {
				await this.productsCache.deleteCacheNewProducts(
					element.id.toString(),
				);
			}
		}
	}
}
