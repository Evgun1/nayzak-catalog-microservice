import { Prisma } from "@prisma/client";
import { Injectable } from "@nestjs/common";
import { ValidationQueryDTO } from "./validation/validationQuery.dto";
import { ModelArgsMap } from "../prisma/interface/modelArgsMap.type";
import { QueryBuilder } from "./query.builder";

// interface T {
// 	address: keyof typeof Prisma.AddressesScalarFieldEnum;
// }

@Injectable()
export class QueryService {
	getQuery<T extends keyof typeof Prisma.ModelName>(
		model: T,
		query: ValidationQueryDTO,
	): ModelArgsMap[T] {
		const builder = QueryBuilder.create(model);
		builder.setQuery(query);
		const getBuilder = builder.getQuery();
		return getBuilder;
	}
}
