import { Provider } from "@nestjs/common";
import { v2 as cloudinary } from "cloudinary";

export const CloudinaryProvider: Provider = {
	provide: "ClOUDINARY",
	useFactory: () => {
		return cloudinary.config({
			cloud_name: process.env.ClOUDINARY_NAME,
			api_key: process.env.ClOUDINARY_API_KEY,
			api_secret: process.env.ClOUDINARY_API_SECRET,
			secure: true,
		});
	},
};
