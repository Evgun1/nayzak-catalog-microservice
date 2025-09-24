import { NewProductsCacheParam } from "../interface/newProductsCache";

export class NewProductsCacheDTO {
	id: number;
	Media?: { src: string; name: string }[] = [];
	title: string;
	price: number;
	discount: number;
	createdAt: Date;
	createdCacheAt: Date;

	constructor(
		data: Pick<
			NewProductsCacheDTO,
			"Media" | "createdAt" | "discount" | "id" | "price" | "title"
		>,
	) {
		for (const key in data) {
			if (Object.keys(this).includes(key)) {
				this[key] = data[key];
			}
		}
		this.createdCacheAt = new Date();
	}
}
