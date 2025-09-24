import { NewProductsCacheDTO } from "src/feature/products/cache/dto/newProductsCache.dto";
import { RedisService } from "src/redis/redis.service";
import { ProductDTOItem, ProductDTOParam } from "../interface/productDTO";
import { NewProductsCacheParam } from "./interface/newProductsCache";
import { ProductCacheDTO } from "../dto/productCache.dto";
import { ProductDTO } from "../dto/product.dto";

export class ProductsCache {
	newProductsCacheKey = "list-new-products";

	constructor(private readonly redis: RedisService) {}
	async uploadCacheNewProducts(
		body: NewProductsCacheParam[],
		count: number = 6,
	) {
		const allCache = await this.getCacheNewProducts();

		if (allCache.length > 0) {
			const ids = allCache.map((product) => product.id);
			await this.deleteCacheNewProducts(ids.toString());
		}

		const cacheProducts = allCache
			.map((data) => Object.values(data)[0])
			.sort(
				(a, b) =>
					new Date(a.createdAt).getTime() -
					new Date(b.createdAt).getTime(),
			);

		const products = body
			.sort(
				(a, b) =>
					new Date(b.createdAt).getTime() -
					new Date(a.createdAt).getTime(),
			)
			.slice(0, count);

		if (products.length <= count - cacheProducts.length) {
			for (const element of products) {
				await this.redis.hSet(this.newProductsCacheKey, {
					[element.id.toString()]: element,
				});
			}
		} else {
			for (let index = 0; index < count - cacheProducts.length; index++) {
				const product = products[index];
				if (!product) continue;

				const findProduct = cacheProducts.find(
					(data) => data.id === product.id,
				);
				if (!findProduct) {
					await this.redis.hSet(this.newProductsCacheKey, {
						[product.id.toString()]: product,
					});
				}
				delete products[index];
			}

			for (let index = 0; index < products.length; index++) {
				const product = products[index];
				if (!product || !product.id) continue;
				const findCacheProducts = cacheProducts.find(
					(data) => data.id === product.id,
				);
				if (findCacheProducts) continue;

				if (cacheProducts.length > 0) {
					const cacheProduct = cacheProducts[index];
					await this.redis.hDel(
						this.newProductsCacheKey,
						cacheProduct.id.toString(),
					);
				}

				await this.redis.hSet(this.newProductsCacheKey, {
					[product.id.toString()]: product,
				});
			}
		}
	}
	async updateCacheNewProducts(body: NewProductsCacheParam[]) {
		const allCache = await this.redis.hGetAll<NewProductsCacheDTO>(
			this.newProductsCacheKey,
		);
		const cacheProducts = allCache
			.map((data) => Object.values(data)[0])
			.sort(
				(a, b) =>
					new Date(a.createdAt).getTime() -
					new Date(b.createdAt).getTime(),
			);

		for (const element of body) {
			const findCacheProduct = cacheProducts.find(
				(product) => (product.id = element.id),
			);
			if (!findCacheProduct) continue;
			await this.redis.hSet(this.newProductsCacheKey, {
				[element.id.toString()]: element,
			});
		}
	}
	async deleteCacheNewProducts(id: string | string[]) {
		await this.redis.hDel(this.newProductsCacheKey, id);
	}
	async getCacheNewProducts() {
		const cache = await this.redis.hGetAll<NewProductsCacheDTO>(
			this.newProductsCacheKey,
		);
		const latestArrivals = cache.map((data) => Object.values(data)[0]);
		return latestArrivals.sort(
			(a, b) =>
				new Date(b.createdAt).getTime() -
				new Date(a.createdAt).getTime(),
		);
	}
	async deleteAllProductFromCache() {
		const redis = this.redis.redis();
		const allProduct = await redis.keys(`product*`);

		const newProducts = await redis.hGetAll(this.newProductsCacheKey);

		for (const element of allProduct) await redis.del(element);

		await this.deleteCacheNewProducts(Object.keys(newProducts));
	}

	async updateProductCache(body: ProductDTO) {
		await this.updateCacheNewProducts([
			{
				id: body.id,
				title: body.title,
				discount: body.discount,
				price: body.price,
				createdAt: body.createdAt as Date,
				Media: body.Media.map((media) => ({
					src: media.src,
					name: media.name,
				})),
			},
		]);

		const productCache = await this.redis.get<ProductCacheDTO>(
			`product-${body.id}`,
		);

		if (!productCache) return;

		const cursProductCache = new ProductCacheDTO({
			count: productCache.count,
			product: body,
		});

		await this.redis.set(`product-${body.id}`, cursProductCache, 60 * 30);
	}
}
