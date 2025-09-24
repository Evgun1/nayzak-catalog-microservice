import {
	AttributeDefinitions,
	Categories,
	Media,
	Prisma,
	Products,
	ProductsAttribute,
	Subcategories,
} from "@prisma/client";
import { ModelMap } from "./modelMap.type";

export interface IncludeMap {
	Categories: Pick<
		Prisma.CategoriesInclude,
		"Media" | "Products" | "Subcategory"
	>;
	Subcategories: Pick<
		Prisma.SubcategoriesInclude,
		"AttributeDefinitions" | "Categories" | "Products"
	>;
	Media: Pick<Prisma.MediaInclude, "Categories" | "Products">;

	Products: Omit<Prisma.ProductsInclude, "_count">;

	// Pick<
	// 	Prisma.ProductsInclude,
	// 	"Categories" | "Media" | "ProductsAttribute" | "Subcategories"
	// >
}

type IncludesParam<T> = {
	[K in keyof T]?: boolean;
};

export type Include = {
	Subcategories?: {
		Products?: IncludesParam<Products>;
		Categories?: IncludesParam<Categories>;
		AttributeDefinitions?: IncludesParam<AttributeDefinitions>;
	};
	Categories?: {
		Products?: IncludesParam<Products>;
		Subcategory?: IncludesParam<Subcategories>;
		Media?: IncludesParam<Media>;
	};
	Products?: {
		Categories?: IncludesParam<Categories>;
		Subcategories?: IncludesParam<Subcategories>;
		Media?: IncludesParam<Media>;
		ProductsAttribute?: IncludesParam<ProductsAttribute>;
	};
	Media?: {
		Products?: IncludesParam<Products>;
		Categories?: IncludesParam<Categories>;
	};
	AttributeDefinitions?: {
		Subcategories?: IncludesParam<Subcategories>;
		ProductAttribute?: IncludesParam<ProductsAttribute>;
	};

	ProductAttribute?: {
		AttributeDefinitions?: IncludesParam<AttributeDefinitions>;
		Products?: IncludesParam<Products>;
	};
};

// export interface IncludeParams<T ex > {
// 	param: IncludeMap[T];
// }
