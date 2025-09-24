import { $Enums, Prisma } from "@prisma/client";

export interface ProductDTOItem {
	id: number;
	title: string;
	price: number;
	createdAt: Date | string;
	description: string;
	discount: number;
	rating: number;
	subcategoriesId: number;
	categoriesId: number;
	media: { src: string; name: string }[];
	status: $Enums.ProductsStatus;
}

export type ProductDTOParam = {
	product?: ProductDTOItem;
	count: number;
};
