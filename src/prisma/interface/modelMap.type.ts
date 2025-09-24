import {
	AttributeDefinitions,
	Categories,
	Media,
	Prisma,
	Products,
	ProductsAttribute,
	Subcategories,
} from "@prisma/client";

export type ModelMap = {
	Categories: Categories;
	Media: Media;
	Products: Products & { Media?: Media[] };
	Subcategories: Subcategories;
	AttributeDefinitions: AttributeDefinitions;
	ProductsAttribute: ProductsAttribute;
};

export const Enums = {
	Products: Prisma.ProductsScalarFieldEnum,
	Categories: Prisma.CategoriesScalarFieldEnum,
	Subcategories: Prisma.SubcategoriesScalarFieldEnum,
	Media: Prisma.MediaScalarFieldEnum,
	AttributeDefinitions: Prisma.AttributeDefinitionsScalarFieldEnum,
	ProductsAttribute: Prisma.ProductsAttributeScalarFieldEnum,
};
