import { Prisma } from "@prisma/client";

export type ModelArgsMap = {
	[Prisma.ModelName.Categories]: {
		where: Prisma.CategoriesWhereInput;
		orderBy: Prisma.CategoriesOrderByWithRelationInput;
		skip: number | undefined;
		take: number | undefined;
	};
	[Prisma.ModelName.Media]: {
		where: Prisma.MediaWhereInput;
		orderBy: Prisma.MediaOrderByWithRelationInput;
		skip: number | undefined;
		take: number | undefined;
	};
	[Prisma.ModelName.Products]: {
		where: Prisma.ProductsWhereInput;
		orderBy: Prisma.ProductsOrderByWithRelationInput;
		skip: number | undefined;
		take: number | undefined;
	};
	[Prisma.ModelName.Subcategories]: {
		where: Prisma.SubcategoriesWhereInput;
		orderBy: Prisma.SubcategoriesOrderByWithRelationInput;
		skip: number | undefined;
		take: number | undefined;
	};
	[Prisma.ModelName.AttributeDefinitions]: {
		where: Prisma.AttributeDefinitionsWhereInput;
		orderBy: Prisma.AttributeDefinitionsOrderByWithRelationInput;
		skip: number | undefined;
		take: number | undefined;
	};
	[Prisma.ModelName.ProductsAttribute]: {
		where: Prisma.ProductsAttributeWhereInput;
		orderBy: Prisma.ProductsAttributeOrderByWithRelationInput;
		skip: number | undefined;
		take: number | undefined;
	};
};
