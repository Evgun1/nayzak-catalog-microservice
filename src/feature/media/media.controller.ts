import { MediaService } from "src/feature/media/media.service";
import { Controller, Get, Param, Post } from "@nestjs/common";
import { ValidationMEdiaByProductParam } from "./validation/validationMediaByProduct";

@Controller("media")
export class MediaController {
	constructor(private readonly mediaService: MediaService) {}

	@Post()
	async uploadMedia() {}

	@Get("by-product/:productId")
	async getByProduct(@Param() param: ValidationMEdiaByProductParam) {
		const media = await this.mediaService.getMediaByProduct(
			param.productId,
		);

		return media;
	}
}
