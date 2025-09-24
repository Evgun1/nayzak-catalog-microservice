import { $Enums } from "@prisma/client";
import { v2 as cloudinary, ImageFormat } from "cloudinary";
import { Injectable } from "@nestjs/common";
import { CloudinaryResponse } from "./type";

type CloudinaryUploadImageParams = {
	buffer: Buffer;
	name?: string;
	folder?: string;
	format?: ImageFormat;
};

const cloudinaryFolder = "nayzak-images";

const url1 = `https://api.cloudinary.com/v1_1/${process.env.ClOUDINARY_NAME}/resources/image/folder/nayzak-images`;
const url2 = `https://${process.env.CLOUDINARY_API_KEY}:${process.env.ClOUDINARY_API_SECRET}@api.cloudinary.com/v1_1/${process.env.ClOUDINARY_NAME}/resources/image/folder`;
@Injectable()
export class CloudinaryService {
	// async get() {
	// 	return await cloudinary.api.resources({
	// 		type: "upload",
	// 		prefix: "nayzak-images/",
	// 		resource_type: "image",
	// 	});
	// }

	async uploadImage(
		file: CloudinaryUploadImageParams,
	): Promise<CloudinaryResponse> {
		const buffer = Buffer.from(file.buffer);

		return new Promise((resolve, reject) => {
			cloudinary.uploader
				.upload_stream(
					{
						resource_type: "image",
						folder: file.folder
							? `${cloudinaryFolder}_${file.folder}`
							: cloudinaryFolder,
						format: file.format,
						filename_override: file.name,
					},
					(err, result) => {
						if (err) console.log(err);
						if (!result) return;
						return resolve(result);
					},
				)
				.end(buffer);
		});
	}
}
