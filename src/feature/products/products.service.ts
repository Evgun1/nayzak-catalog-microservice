import { Where } from "./../../prisma/interface/where";
import { NewProductsCacheDTO } from "src/feature/products/cache/dto/newProductsCache.dto";
import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { ProductCacheDTO } from "./dto/productCache.dto";
import { PrismaService } from "../../prisma/prisma.service";

import { ProductsCache } from "./cache/products.cache";
import { ProductsAllDTO } from "./dto/productsAll.dto";
import { ProductDTO } from "./dto/product.dto";
import { ClientApiService } from "src/client-api/clientApi.service";
import { RedisService } from "src/redis/redis.service";
import { ProductPrisma } from "./prisma/product.prisma";
import { ProductsPrismaArgs } from "./prisma/interface/productsPrismaArgs.interface";
import { ProductsWhereInput } from "src/prisma/interface/where";
import { ValidationProductsKafkaPayloadDTO } from "./validation/validationProductsKafka.dto";
import { ValidationMinMaxPriceParamDTO } from "./validation/validationMinMaxPice.dto";
import { ValidationProductParamDTO } from "./validation/validationProduct.dto";
import { ValidationProductsAllQueryDTO } from "./validation/validationProductsAll.dto";
import { ValidationUploadProductBodyDTO } from "./validation/validationProductUpload.dto";
import { ValidationProductUpdateBodyDTO } from "./validation/validationProductUpdate.dto";
import {
	ValidationProductsByParamsParamDTO,
	ValidationProductsByParamsQueryDTO,
} from "./validation/validationProductsByParams.dto";
import { ProductsKafkaDTO } from "./dto/productsKafka.dto";

export type GetProductsAllParams = Partial<ValidationProductsByParamsQueryDTO> &
	Partial<ValidationProductsByParamsParamDTO> &
	ValidationProductsAllQueryDTO;

@Injectable()
export class ProductsService {
	productsCache: ProductsCache;

	constructor(
		private readonly productPrisma: ProductPrisma,
		private readonly clientApi: ClientApiService,
		private readonly redis: RedisService,
		private readonly prisma: PrismaService,
	) {
		this.productsCache = new ProductsCache(redis);
	}

	async getProductsAll(params: GetProductsAllParams) {
		const where: ProductsWhereInput = {};
		const whereAnd: ProductsWhereInput[] = [];

		if (params.productsId) {
			where.id = {
				in: params.productsId,
			};
		}
		if (params.categoryId) {
			if (!Number.isNaN(+params.categoryId)) {
				where.categoriesId = +params.categoryId;
			} else {
				where.Categories = { title: `*${params.categoryId}*` };
			}
		}
		if (params.subcategoryId) {
			if (!Number.isNaN(+params.subcategoryId)) {
				where.subcategoriesId = +params.subcategoryId;
			} else {
				where.Subcategories = { title: `*${params.subcategoryId}*` };
			}
		}
		if (params.minPrice && params.maxPrice) {
			where["ROUND(price - price * discount / 100)"] = {
				between: [+params.minPrice, +params.maxPrice],
			};
		}

		if (params.color) {
			whereAnd.push({
				ProductsAttribute: {
					AttributeDefinitions: {
						id: {
							in: params.color,
						},
					},
				},
			});
		}
		if (params.material) {
			whereAnd.push({
				ProductsAttribute: {
					AttributeDefinitions: {
						id: {
							in: params.material,
						},
					},
				},
			});
		}
		if (params.manufacturer) {
			whereAnd.push({
				ProductsAttribute: {
					AttributeDefinitions: {
						id: {
							in: params.manufacturer,
						},
					},
				},
			});
		}

		where.AND = [...whereAnd];

		const offset =
			params.page && params.limit
				? (params.page - 1) * params.limit
				: params.offset;

		const orderBy =
			params.sortBy && params.sort
				? params.searchBy?.includes("pice")
					? { ["ROUND(price - price * discount / 100)"]: params.sort }
					: {
							[params.sortBy]: params.sort,
						}
				: undefined;

		const args = {
			includes: { Media: { src: true, name: true } },
			where,
			limit: params.limit,
			offset,
			orderBy,
		} as ProductsPrismaArgs;

		const products = await this.productPrisma.getProducts(args);
		const count = await this.productPrisma.getProductsCount(args);

		const allProductsDTO = products.map((product) => {
			return new ProductsAllDTO({
				Media: product.Media,
				...product,
			});
		});

		return { products: allProductsDTO, productCounts: count };
	}

	async getProduct(param: ValidationProductParamDTO) {
		const { id } = param;
		const cacheKey = `product-${id}`;

		const thirtyMin = 60 * 30;
		const productCache = await this.redis.get<ProductCacheDTO>(cacheKey);

		const setProductCache = async (
			value: ProductCacheDTO,
			second: number = 60 * 30,
		) => {
			const { count, product } = value;

			const productCacheDTO = new ProductCacheDTO({ count });

			if (productCache?.count && productCache.count < 10) {
				return await this.redis.set(
					cacheKey,
					{ count: productCacheDTO.count },
					second,
				);
			}

			if (
				productCache &&
				!productCache.product &&
				productCache.count >= 10
			) {
				if (product) productCacheDTO.product = product;
				return await this.redis.set(cacheKey, productCacheDTO, second);
			}

			return await this.redis.set(cacheKey, value, second);
		};

		if (productCache && productCache.product) {
			const ttl = await this.redis.ttl(cacheKey);
			await setProductCache(
				{
					count: ++productCache.count,
					product: productCache.product,
				},
				ttl === -1 ? 0 : ttl,
			);

			if (Number.isInteger(10 / productCache.count)) {
				await this.redis.expire(cacheKey, thirtyMin);
			}

			return productCache.product;
		}

		const product = await this.prisma.products.findUnique({
			include: {
				Media: { select: { src: true, name: true } },
				Categories: { select: { title: true, id: true } },
				Subcategories: { select: { title: true, id: true } },
			},

			where: { id },
		});

		if (!product) return;

		const productDTO = new ProductDTO({
			...product,
			// Categories: product.Categories,
			// Subcategories: product.Subcategories,
			Media: product.Media.map((media) => ({
				src: media.src,
				name: media.name,
			})),
		});

		const productCacheDTO = new ProductCacheDTO({
			product: productDTO,
			count: productCache?.count ? ++productCache.count : 1,
		});

		// if (productCache && !productCache.product && productCache.count >= 10) {
		// 	await setProductCache(
		// 		{
		// 			product: productDTO,
		// 			count: productCache.count,
		// 		},
		// 		thirtyMin,
		// 	);
		// }

		await setProductCache(productCacheDTO);

		return productDTO;
	}

	async getNewProducts() {
		const cacheProducts = await this.productsCache.getCacheNewProducts();

		if (cacheProducts.length >= 6) return cacheProducts;

		const products = await this.getProductsAll({
			sortBy: "createdAt",
			sort: "DESC",
			limit: 6,
		});

		const newProductsCacheDTO = products.products.map((product) => {
			return new NewProductsCacheDTO({
				...product,
				Media: product.Media,
			});
		});

		await this.productsCache.uploadCacheNewProducts(newProductsCacheDTO);
		return newProductsCacheDTO;
	}

	async uploadMany(body: any[]) {
		const products = await this.prisma.products.createManyAndReturn({
			data: body,
		});

		await this.clientApi.clearCache("products");
		return products;
	}

	async uploadProduct(body: ValidationUploadProductBodyDTO) {
		const product = await this.prisma.products.create({
			data: {
				description: body.description,
				discount: body.discount ?? 0,
				price: body.price,
				title: body.title,
				status: body.status,
				categoriesId: body.categoriesId,
				subcategoriesId: body.subcategoriesId,
			},
			select: {
				categoriesId: true,
				createdAt: true,
				description: true,
				discount: true,
				id: true,
				price: true,
				rating: true,
				status: true,
				title: true,
				subcategoriesId: true,
				updatedAt: true,
				Media: { select: { src: true } },
			},
		});

		await this.clientApi.clearCache("products");
		return product;
	}

	async updateProduct(body: ValidationProductUpdateBodyDTO) {
		const product = await this.prisma.products.update({
			include: {
				Media: { select: { src: true, name: true } },
				Categories: true,
				Subcategories: true,
			},
			where: { id: body.id },
			data: { ...body },
		});

		const productDTO = new ProductDTO(product);

		await this.productsCache.updateProductCache(product);
		await this.clientApi.clearCache("products");
		return productDTO;
	}

	async getMinMaxPrice(params: ValidationMinMaxPriceParamDTO) {
		const { categoryId, subcategoryId } = params;

		const args: Prisma.ProductsFindManyArgs = {
			select: { price: true, discount: true },
		};

		if (!Number.isNaN(categoryId) && !Number.isNaN(categoryId)) {
			args.where = {
				categoriesId: categoryId,
				subcategoriesId: subcategoryId,
			};
		} else {
			args.where = {
				Categories: {
					id: categoryId,
				},
			};
			args.where = {
				Subcategories: {
					id: subcategoryId,
				},
			};
		}

		const products = await this.prisma.products.findMany(args);

		const minPrice = Math.floor(
			Math.min(
				...products.map(
					(value) =>
						value.price -
						(value.price * (value.discount ?? 0)) / 100,
				),
			),
		);
		const maxPrice = Math.floor(
			Math.max(
				...products.map(
					(value) =>
						value.price -
						(value.price * (value.discount ?? 0)) / 100,
				),
			),
		);

		return { minPrice, maxPrice };
	}

	async productsKafka(payload: ValidationProductsKafkaPayloadDTO) {
		const { products } = await this.getProductsAll({
			productsId: payload.productsId,
		});
		const productsKafkaDTO = products.map(
			(product) => new ProductsKafkaDTO({ ...product }),
		);
		return productsKafkaDTO;
	}

	// @Cron("* * * * * 1")
	// async checkCachePopularProduct() {
	// 	const redisKey = "popular-products";
	// 	const weekAgo = new Date();
	// 	weekAgo.setDate(weekAgo.getDate() - 7);
	// 	const cachePopularProducts =
	// 		await this.redis.hGetAll<PopularProductsCacheDTO>(redisKey);

	// 	const popularProductsFields: string[] = [];
	// 	if (!cachePopularProducts) return;

	// 	for (const element of cachePopularProducts) {
	// 		Object.values(element).forEach((data) => {
	// 			const createCacheAt = new Date(data.updateAt);

	// 			if (createCacheAt <= weekAgo) {
	// 				Object.keys(element).forEach((field) => {
	// 					popularProductsFields.push(field);
	// 				});
	// 			}
	// 		});
	// 	}

	// 	if (popularProductsFields.length <= 0) {
	// 		return await this.redis.hDel(redisKey, popularProductsFields);
	// 	}
	// }
}
