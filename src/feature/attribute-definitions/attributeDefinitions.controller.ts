import { AttributeDefinitionsService } from "./attributeDefinitions.service";
import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { ValidationAttributeUploadManyBodyDTO } from "./validation/validationAttributeUpload.dto";
import {
	ValidationAttributeByParamParamDTO,
	ValidationAttributeByParamQueryDTO,
} from "./validation/validationAttributeByParam.dto";
import { ValidationAttributesQueryDTO } from "./validation/validationAttributes.dto";
import { ValidationAttributeByProductParamDTO } from "./validation/validationAttributeByProduct.dto.";

@Controller("attribute-definitions")
export class AttributeDefinitionsController {
	constructor(
		private readonly attributeDefinitionsService: AttributeDefinitionsService,
	) {}

	@Get("/")
	async getAttributes(@Query() query: ValidationAttributesQueryDTO) {
		const attributes = await this.attributeDefinitionsService.getAll(query);
		return attributes;
	}

	@Get("/:subcategoryId")
	async getAttributeByParam(
		@Param() param: ValidationAttributeByParamParamDTO,
		@Query() query: ValidationAttributeByParamQueryDTO,
	) {
		const result = await this.attributeDefinitionsService.getByParam(
			param,
			query,
		);

		return result;
	}
	@Get("/by-product/:productId")
	async getAttributeByProduct(
		@Param() param: ValidationAttributeByProductParamDTO,
		// @Query() query: ValidationAttributeByParamQueryDTO,
	) {
		const result = await this.attributeDefinitionsService.getAll(param);

		return result;
	}

	@Post()
	async createMany(@Body() body: ValidationAttributeUploadManyBodyDTO) {
		return body;
	}
}
