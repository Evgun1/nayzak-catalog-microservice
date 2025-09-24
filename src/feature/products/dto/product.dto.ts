import { $Enums } from "@prisma/client";
export class ProductDTO {
	id: number;
	title: string;
	price: number;
	createdAt: Date | string;
	description: string;
	discount: number;
	rating: number;
	Categories: { id: number; title: string };
	Subcategories: { id: number; title: string };
	Media: { src: string; name: string }[];
	status: $Enums.ProductsStatus;

	constructor(item: ProductDTO) {
		for (const key in item) {
			if (!Object.keys(this).includes(key)) continue;
			this[key] = item[key];
		}
	}
}
