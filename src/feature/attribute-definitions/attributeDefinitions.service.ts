import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import {
	ValidationAttributeByParamParamDTO,
	ValidationAttributeByParamQueryDTO,
} from "./validation/validationAttributeByParam.dto";
import { Prisma } from "@prisma/client";
import {
	GetProductsAllParams,
	ProductsService,
} from "../products/products.service";
import { AttributeDTO } from "./dto/attribute.dto";
import { ValidationAttributeUploadBodyDTO } from "./validation/validationAttributeUpload.dto";
import { ValidationAttributesQueryDTO } from "./validation/validationAttributes.dto";
import { QueryService } from "src/query/query.service";
import { ValidationAttributeByProductParamDTO } from "./validation/validationAttributeByProduct.dto.";

type GetAllParam = ValidationAttributesQueryDTO &
	Partial<ValidationAttributeByProductParamDTO>;
@Injectable()
export class AttributeDefinitionsService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly productsService: ProductsService,
		private query: QueryService,
	) {}

	async getAll(param: GetAllParam) {
		const queryHandler = this.query.getQuery("AttributeDefinitions", param);

		const ids: number[] = [];

		if (param.color) ids.push(...ids, ...param.color);
		if (param.material) ids.push(...ids, ...param.material);
		if (param.manufacturer) ids.push(...ids, ...param.manufacturer);

		const where: Prisma.AttributeDefinitionsWhereInput = {
			...queryHandler.where,
		};

		if (ids.length > 0) {
			where.id = { in: ids };
		}

		if (param.productId)
			where.ProductAttribute = { some: { productsId: param.productId } };

		const attributeArgs: Prisma.AttributeDefinitionsFindManyArgs = {
			where,
		};

		const attributes =
			await this.prisma.attributeDefinitions.findMany(attributeArgs);

		return attributes;
	}

	async getByParam(
		param: ValidationAttributeByParamParamDTO,
		query: ValidationAttributeByParamQueryDTO,
	) {
		const { subcategoryId } = param;

		const where: Prisma.AttributeDefinitionsWhereInput = {
			subcategoriesId: subcategoryId,
		};

		const attribute = await this.prisma.attributeDefinitions.findMany({
			include: {
				ProductAttribute: {
					include: { Products: { select: { id: true } } },
				},
			},
			where: {
				...where,
			},
		});

		const { productCounts } = await this.productsService.getProductsAll({
			...query,
			subcategoryId,
		});
		const attributeDTO: {
			attribute: AttributeDTO[];
			count: number;
		} = { attribute: [], count: productCounts };

		for (const element of attribute) {
			const productsArgs: GetProductsAllParams = {
				subcategoryId,
				...query,
			};

			const attrId = element.id;
			const type = element.name.toLowerCase();

			if (type.includes("color")) {
				productsArgs.color = [attrId];
			}
			if (type.includes("material")) {
				productsArgs.material = [attrId];
			}
			if (type.includes("manufacture")) {
				productsArgs.manufacturer = [attrId];
			}

			const products =
				await this.productsService.getProductsAll(productsArgs);

			const isActive = products.products.length > 0;

			attributeDTO.attribute.push(
				new AttributeDTO({ ...element, active: isActive }),
			);
		}

		return {
			attribute: attributeDTO.attribute,
			countActiveAttributes: productCounts,
		};
	}

	async createMany(body: ValidationAttributeUploadBodyDTO[]) {
		const attribute =
			await this.prisma.attributeDefinitions.createManyAndReturn({
				data: body,
			});

		return attribute;
	}
}
