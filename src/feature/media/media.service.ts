import { CloudinaryService } from "./../../cloudinary/cloudinary.service";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { ValidationMediaUploadDTO } from "./validation/validationMediaUpload.dto";
import { Prisma } from "@prisma/client";
import { UploadApiResponse } from "cloudinary";
import { strict } from "assert";

@Injectable()
export class MediaService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly cloudinary: CloudinaryService,
	) {}

	async uploadMedia(
		file: Pick<Express.Multer.File, "buffer"> & { folder?: string },
		body: ValidationMediaUploadDTO,
	) {
		const { name, dataId } = body;

		const cloudinaryRes = await this.cloudinary.uploadImage({
			buffer: file.buffer,
			folder: file.folder,
		});

		const media = await this.prisma.media.create({
			data: {
				src: cloudinaryRes.url,
				name,
				productsId: dataId.productsId,
				categoriesId: dataId.categoriesId,
				subcategoriesId: dataId.subcategoriesId,
				customersId: dataId.customersId,
			},
		});

		return media;
	}

	async uploadMediaFaker(body: Prisma.MediaCreateManyInput[]) {
		return await this.prisma.media.createMany({
			data: body,
		});
	}
	// async uploadMediaMany(body: UploadMediaDTO[]) {
	// 	const data: Prisma.MediaCreateManyInput[] = body.map((item) => {
	// 		const src = item.src;
	// 		const name = item.name;
	// 		const categoriesId = item.dataId.categoriesId;
	// 		const productsId = item.dataId.productsId;
	// 		const customersId = item.dataId.customersId;

	// 		return { name, src, categoriesId, customersId, productsId };
	// 	});
	// 	(par: UploadApiResponse) => {};
	// 	const media = await this.prisma.media.createManyAndReturn({
	// 		data: data,
	// 	});

	// 	return media;
	// }

	async getMediaByProduct(productId: number) {
		const media = await this.prisma.media.findMany({
			select: { src: true, name: true },
			where: { productsId: productId },
		});

		return media;
	}
}
