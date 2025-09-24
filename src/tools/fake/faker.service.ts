import { CategoriesService } from "./../../feature/categories/categories.service";
import { ProductsService } from "src/feature/products/products.service";
import { $Enums, Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { MediaService } from "src/feature/media/media.service";
import { SubcategoriesService } from "src/feature/subcategories/subcategories.service";
import { AttributeDefinitionsService } from "src/feature/attribute-definitions/attributeDefinitions.service";
import { ValidationAttributeUploadBodyDTO } from "src/feature/attribute-definitions/validation/validationAttributeUpload.dto";

@Injectable()
export class FakerService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly productsService: ProductsService,
		private readonly categoriesService: CategoriesService,
		private readonly subcategoriesService: SubcategoriesService,
		private readonly mediaService: MediaService,
		private readonly attributeDefinitionsService: AttributeDefinitionsService,
	) {}
	async generateProductsFaker() {
		const statusArr: $Enums.ProductsStatus[] = [
			"discontinued",
			"inStock",
			"outOfStock",
		];
		const resultSubcategories = await this.prisma.subcategories.findMany({
			select: { id: true, categoriesId: true },
		});
		const subcategoriesId = resultSubcategories.map((value) => ({
			id: value.id,
			categoriesId: value.categoriesId,
		}));

		const result: Prisma.ProductsCreateManyInput[] = [];

		for (let index = 1; index <= 300; index++) {
			const title = faker.commerce.product();
			const description = faker.commerce.productDescription();
			const price = parseInt(
				faker.commerce.price({ min: 10, max: 1000 }),
			);

			const discount = Math.floor(Math.random() * 100);
			const randomIndexStatus = Math.floor(
				Math.random() * statusArr.length,
			);
			const status = statusArr[randomIndexStatus];
			const randomIndexSubcategories = Math.floor(
				Math.random() * subcategoriesId.length,
			);
			const subcategoryId = subcategoriesId[randomIndexSubcategories].id;
			const categoryId =
				subcategoriesId[randomIndexSubcategories].categoriesId;

			const data: Prisma.ProductsCreateManyInput = {
				title,
				description,
				price,
				status,
				discount,
				categoriesId: categoryId,
				subcategoriesId: subcategoryId,
			};

			result.push(data);
		}

		await this.productsService.uploadMany(result);
	}
	async generateCategoriesFaker() {
		for (let index = 1; index <= 4; index++) {
			await this.prisma.categories.create({
				data: {
					title: faker.commerce.department(),
				},
			});
		}
		return;
	}
	async generateSubcategoriesFaker() {
		const resultCategories = await this.prisma.categories.findMany({
			select: { id: true },
		});

		const categoriesId = resultCategories.map((value) => value.id);

		for (let index = 1; index <= 10; index++) {
			const randomIndexCategories = Math.floor(
				Math.random() * categoriesId.length,
			);
			const categoryId = categoriesId[randomIndexCategories];

			await this.prisma.subcategories.create({
				data: {
					title: faker.commerce.department(),
					categoriesId: categoryId,
				},
			});
		}

		return;
	}
	async generateMediaFaker() {
		const products = await this.prisma.products.findMany();
		const { categories } = await this.categoriesService.getCategoriesAll();
		const { subcategories } =
			await this.subcategoriesService.getSubcategories({});

		const arr: Prisma.MediaCreateManyInput[] = [];

		if (products.length > 0) {
			for (const element of products) {
				for (let index = 1; index <= 5; index++) {
					const src = faker.image.urlPicsumPhotos({
						blur: 0,
						grayscale: false,
						height: 889,
						width: 652,
					});

					arr.push({
						src,
						productsId: element.id,
						name: element.title,
					});
				}
			}
		}

		if (categories.length > 0) {
			for (const element of categories) {
				const src = faker.image.urlPicsumPhotos({
					blur: 0,
					grayscale: false,
					height: 800,
					width: 800,
				});

				arr.push({
					src,
					name: element.title,
					categoriesId: element.id,
				});
			}
		}

		if (subcategories.length > 0) {
			for (const element of subcategories) {
				const src = faker.image.urlPicsumPhotos({
					blur: 0,
					grayscale: false,
					height: 800,
					width: 800,
				});

				arr.push({
					src,
					name: element.title,
					subcategoriesId: element.id,
				});
			}
		}

		await this.mediaService.uploadMediaFaker(arr);
	}

	async generateAttributeFaker() {
		const subcategories = await this.subcategoriesService.getSubcategories(
			{},
		);
		const allAttributes: ValidationAttributeUploadBodyDTO[] = [];

		for (const subcategory of subcategories.subcategories) {
			const random = Math.floor(Math.random() * 20) + 1;

			const existingTypes = new Set<string>();

			const pushIfUnique = (
				arr: ValidationAttributeUploadBodyDTO[],
				item: ValidationAttributeUploadBodyDTO,
			) => {
				const key = item.type.toLowerCase();
				if (existingTypes.has(key)) return;
				existingTypes.add(key);
				arr.push(item);
			};

			const colorArr: ValidationAttributeUploadBodyDTO[] = [];
			for (let index = 0; index < random; index++) {
				const colorFaker = faker.color.rgb({ format: "hex" });
				pushIfUnique(colorArr, {
					name: "color",
					type: colorFaker,
					subcategoriesId: subcategory.id,
				});
			}

			const manufacturerArr: ValidationAttributeUploadBodyDTO[] = [];
			for (let index = 0; index < random; index++) {
				const manufacturerFaker = faker.vehicle.manufacturer();
				pushIfUnique(manufacturerArr, {
					name: "manufacturer",
					type: manufacturerFaker,
					subcategoriesId: subcategory.id,
				});
			}

			const materialArr: ValidationAttributeUploadBodyDTO[] = [];
			for (let index = 0; index < random; index++) {
				const materialFaker = faker.commerce.productMaterial();
				pushIfUnique(materialArr, {
					name: "material",
					type: materialFaker,
					subcategoriesId: subcategory.id,
				});
			}

			allAttributes.push(...colorArr, ...manufacturerArr, ...materialArr);
		}

		await this.attributeDefinitionsService.createMany(allAttributes);

		const attribute = await this.attributeDefinitionsService.getAll({});
		const products = await this.prisma.products.findMany();

		if (attribute.length < 0 || products.length < 0) return;

		const productAttributesData: Prisma.ProductsAttributeCreateManyInput[] =
			[];

		for (const product of products) {
			const attributeFilter = attribute.filter(
				(attr) => attr.subcategoriesId === product.subcategoriesId,
			);

			const color = attributeFilter.filter((item) =>
				item.name.includes("color"),
			);
			const material = attributeFilter.filter((item) =>
				item.name.includes("material"),
			);
			const manufacture = attributeFilter.filter((item) =>
				item.name.includes("manufacture"),
			);

			const randomColor = Math.floor(Math.random() * material.length);
			const randomMaterial = Math.floor(Math.random() * material.length);
			const randomManufacture = Math.floor(
				Math.random() * manufacture.length,
			);

			if (color[randomColor])
				productAttributesData.push({
					attributeDefinitionsId: color[randomColor].id,
					productsId: product.id,
				});
			if (material[randomMaterial])
				productAttributesData.push({
					attributeDefinitionsId: material[randomMaterial].id,
					productsId: product.id,
				});

			if (manufacture[randomManufacture])
				productAttributesData.push({
					attributeDefinitionsId: manufacture[randomManufacture].id,
					productsId: product.id,
				});
		}
		await this.prisma.productsAttribute.createMany({
			data: productAttributesData,
		});
	}
}
