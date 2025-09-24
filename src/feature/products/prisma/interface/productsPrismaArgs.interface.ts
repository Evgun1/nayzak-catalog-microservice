import { ProductsWhereInput } from "src/prisma/interface/where";
import {
	ProductsPrismaIncludes,
	ProductsPrismaOrderBy,
	ProductsPrismaSelect,
	ProductsPrismaWhere,
} from "./productsPrismaArgsItem";

export interface ProductsPrismaArgs {
	select?: ProductsPrismaSelect;
	includes?: ProductsPrismaIncludes;
	where?: ProductsWhereInput;
	orderBy?: ProductsPrismaOrderBy;
	limit?: number;
	offset?: number;
}
