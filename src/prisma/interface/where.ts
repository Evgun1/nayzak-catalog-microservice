import {
	AttributeDefinitions,
	Categories,
	Media,
	Prisma,
	Products,
	ProductsAttribute,
	Subcategories,
} from "@prisma/client";

export interface WhereObjectItem {
	in?: number[];
	between?: [number, number];
}

export type WhereParams<T> = {
	[K in keyof T]?: T[K] extends string
		? string
		: T[K] extends number
			? WhereObjectItem | number
			: T[K] extends number[]
				? number[]
				: T[K];
};

export type ProductsWhereInput = WhereParams<Products> & {
	AND?: ProductsWhereInput[];
	Categories?: CategoriesWhereInput;
	Subcategories?: SubcategoriesWhereInput;
	Media?: MediaWhereInput;
	ProductsAttribute?: ProductsAttributeWhereInput;
};

export type CategoriesWhereInput = WhereParams<Categories> & {
	AND?: CategoriesWhereInput[];
	Products?: ProductsWhereInput;
	Subcategories?: SubcategoriesWhereInput;
	Media?: MediaWhereInput;
};

export type SubcategoriesWhereInput = WhereParams<Subcategories> & {
	AND?: SubcategoriesWhereInput[];
	Products?: ProductsAttributeWhereInput;
	Categories?: CategoriesWhereInput;
	AttributeDefinitions?: AttributeDefinitions;
	Media?: MediaWhereInput;
};
export type MediaWhereInput = WhereParams<Media> & {
	AND?: MediaWhereInput[];
	Products?: ProductsWhereInput;
	Categories?: CategoriesWhereInput;
	Subcategories?: SubcategoriesWhereInput;
};

export type ProductsAttributeWhereInput = WhereParams<ProductsAttribute> & {
	AND?: ProductsAttributeWhereInput[];
	AttributeDefinitions?: AttributeDefinitionsWhereInput;
	Products?: ProductsAttribute;
};
export type AttributeDefinitionsWhereInput = WhereParams<AttributeDefinitions> & {
	AND?: AttributeDefinitionsWhereInput[];
	Subcategories?: SubcategoriesWhereInput;
	ProductAttribute?: ProductsAttributeWhereInput;
};

export type Where = {
	Products: Partial<ProductsWhereInput>;
	Categories: Partial<CategoriesWhereInput>;
	Subcategories: Partial<SubcategoriesWhereInput>;
	Media: Partial<MediaWhereInput>;
	AttributeDefinitions: Partial<AttributeDefinitionsWhereInput>;
	ProductsAttribute: Partial<ProductsAttributeWhereInput>;
};
