import { $Enums } from "@prisma/client";

export class ProductsAllDTO {
	id: number;
	Media?: { src: string; name: string }[] = [];
	rating: number;
	title: string;
	price: number;
	discount: number;
	description: string;
	status: $Enums.ProductsStatus;
	createdAt: Date;
	constructor(item: ProductsAllDTO) {
		for (const key in item) {
			if (Object.keys(this).includes(key)) this[key] = item[key];
		}

		// const {
		// 	discount,
		// 	id,
		// 	price,
		// 	rating,
		// 	Media,
		// 	title,
		// 	createdAt,
		// 	description,
		// 	status,
		// } = item;

		// this.id = id;
		// this.price = price;
		// this.discount = discount;
		// this.rating = rating;
		// this.Media = Media;
		// this.status = status;
		// this.title = title;
		// this.createdAt = createdAt;
		// this.description = description;
	}
}
