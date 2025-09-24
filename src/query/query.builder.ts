import { Prisma } from "@prisma/client";
import { ValidationQueryDTO } from "./validation/validationQuery.dto";
import { ModelArgsMap } from "../prisma/interface/modelArgsMap.type";
import { ModelMap } from "../prisma/interface/modelMap.type";

export class QueryBuilder<TModel extends keyof typeof Prisma.ModelName> {
	private model: TModel;
	private where: ModelArgsMap[TModel]["where"];
	private orderBy: ModelArgsMap[TModel]["orderBy"];
	private skip: ModelArgsMap[TModel]["skip"];
	private take: ModelArgsMap[TModel]["take"];
	private enum: ModelMap[TModel];

	private constructor(model: TModel) {
		this.model = model;
		this.enum as typeof this.enum;
		this.where = {} as typeof this.where;
		this.orderBy = {} as typeof this.orderBy;
		this.skip = undefined as typeof this.skip;
		this.take = undefined as typeof this.take;
	}

	static create<T extends keyof typeof Prisma.ModelName>(
		model: T,
	): QueryBuilder<T> {
		return new QueryBuilder(model);
	}

	private clearArgs() {
		this.where = {};
		this.orderBy = {};
		this.skip = undefined;
		this.take = undefined;
	}

	private setLimit(limit: number) {
		this.take = limit;
		return this;
	}
	private setSort(sort: Record<string, "ASC" | "DESC">) {
		this.orderBy = sort;
		return this;
	}
	private setPage(page: number) {
		const currentPage = (page - 1) * (this.take ?? 0);
		this.skip = currentPage;
		return this;
	}
	private setOffset(offset: number) {
		this.skip = offset;
		return this;
	}
	private setSearch(search: Record<string, string>) {
		for (const key in search) {
			if (Object.keys(this.enum).includes(key)) {
				this.where[key] = search[key];
			}
		}
	}

	setQuery(query: ValidationQueryDTO) {
		this.clearArgs();
		const { filter, limit, offset, page, search, sort, sortBy, searchBy } =
			query;
		if (limit) {
			this.setLimit(limit);
		}
		if (offset) {
			this.setOffset(offset);
		}
		if (page) {
			this.setPage(page);
		}
		if (search && searchBy) {
			this.setSearch({ [searchBy]: search });
		}
		if (sortBy && sort) {
			this.setSort({ [sortBy]: sort });
		}
	}

	getQuery(): ModelArgsMap[TModel] {
		const { orderBy, skip, take, where } = this;
		return { orderBy, skip, take, where } as ModelArgsMap[TModel];
	}
}
