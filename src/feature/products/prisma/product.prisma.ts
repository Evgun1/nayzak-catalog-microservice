import { $Enums, Categories, Prisma, Subcategories } from "@prisma/client";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { ProductsPrismaIncludes } from "./interface/productsPrismaArgsItem";
import { ProductsPrismaArgs as ProductsPrismaArgs } from "./interface/productsPrismaArgs.interface";
import { log } from "console";

@Injectable()
export class ProductPrisma {
	constructor(private readonly prisma: PrismaService) {}

	public async getProducts(args?: ProductsPrismaArgs) {
		const sqlQuery = await this.prisma.sqlQuery("Products");
		const find = sqlQuery.find;

		if (args?.select) find.select(args.select);

		if (args?.includes) {
			find.include(args.includes);
		}
		if (args?.where) {
			const where = args.where;
			find.where(where);
		}

		if (args?.limit) find.limit(+args.limit);
		if (args?.offset) find.offset(args.offset);
		if (args?.orderBy) find.orderBy(args.orderBy);

		// find.whereExist({ Products: {} });
		return find.query();
	}

	async getProductsCount(args?: ProductsPrismaArgs) {
		const count = (await this.prisma.sqlQuery("Products")).count;
		if (args?.where) {
			const where = args.where;
			count.where(where);
		}

		return await count.query();
	}
}
