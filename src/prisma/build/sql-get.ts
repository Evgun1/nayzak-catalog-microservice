import { Prisma } from "@prisma/client";

type testT = {
	select?: Prisma.ProductsSelect;
	include?: {
		Media?: Prisma.MediaFindManyArgs;
		Categories?: Prisma.CategoriesFindManyArgs;
		Subcategories?: Prisma.SubcategoriesFindManyArgs;
	};
	where?: Prisma.ProductsWhereInput;
	limit?: number;
	offset?: number;
};

export class SqlGet {
	constructor() {}

	async products(args: testT) {}
	async subcategories(args: Prisma.SubcategoriesFindManyArgs) {}
	async categories(args: Prisma.CategoriesFindManyArgs) {}
	async media(args: Prisma.MediaFindManyArgs) {}
}
