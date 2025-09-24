import {
	AttributeDefinitions,
	Categories,
	Media,
	Products,
	ProductsAttribute,
	Subcategories,
} from "@prisma/client";

interface WhereObjectItem {
	in?: number[];
	between?: [number, number];
}

export type WhereR<T> = {
	[K in keyof T]?: T[K] extends string
		? string
		: T[K] extends number
			? WhereObjectItem | number
			: never;
};

export type WhereParams<T> = {
	[K in keyof T]?: T[K] extends string
		? string
		: T[K] extends number
			? WhereObjectItem | number
			: T[K] extends number[]
				? number[]
				: T[K];
};

export interface ProductsPrismaWhere extends WhereParams<Products> {
	Categories?: WhereParams<Categories>;
	Subcategories?: WhereParams<Subcategories>;
	Media?: WhereParams<Media>;
	ProductsAttribute?: WhereParams<ProductsAttribute> & {
		AttributeDefinitions?: WhereParams<AttributeDefinitions>;
	};
}

type OrderByParam<T> = {
	[K in keyof T as T[K] extends number | Date ? K : never]?: "ASC" | "DESC";
};

export interface ProductsPrismaOrderBy extends OrderByParam<Products> {}

type IncludesParam<T> = {
	[K in keyof T]?: boolean;
};

export interface ProductsPrismaIncludes {
	Categories?: IncludesParam<Categories>;
	Subcategories?: IncludesParam<Subcategories>;
	Media?: IncludesParam<Media>;
	ProductsAttribute?: IncludesParam<ProductsAttribute>;
}

type SelectParam<T> = {
	[K in keyof T]?: boolean;
};

export interface ProductsPrismaSelect extends SelectParam<Products> {}
