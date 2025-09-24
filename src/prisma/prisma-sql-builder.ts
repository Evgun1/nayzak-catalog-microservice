import { Prisma } from "@prisma/client";
import { PrismaService } from "./prisma.service";
import { Include } from "./interface/include";
import { Enums, ModelMap } from "./interface/modelMap.type";
import { Where } from "./interface/where";
import { checkTwoArraysForCompatibility } from "src/utils/checkTwoArraysForCompatibility";

interface WhereObjectItem {
	in?: number[];
	between?: [number, number];
}

type WhereParams<T = Record<string, any>> = {
	[key in keyof T]?: WhereObjectItem | string | number | number[];
};

type OrderByParam<T> = {
	[K in keyof T as T[K] extends number | Date ? K : never]?: "ASC" | "DESC";
};

const whereBuild = (conditions: WhereParams) => {
	let clause: string | undefined = "";
	const args: Array<WhereObjectItem | string | number> = [];
	let i = 1;
	for (let key in conditions) {
		let value = conditions[key] as WhereObjectItem | string | number;

		if (!key.includes('"')) key = `"${key}"`;
		if (key.includes("ROUND")) key = key.replaceAll('"', "");

		let condition;
		if (typeof value === "number") {
			condition = `${key} = ${value}`;
		} else if (typeof value === "object") {
			if (Array.isArray(value)) {
				if (value.every((el) => !Number.isNaN(el))) {
					condition = `${key} IN (${value.join(", ")})`;
				}
			}

			if (value.in) {
				condition = `${key} IN (${value.in.join(", ")})`;
			}
			if (value.between) {
				const [first, last] = value.between;
				condition = `${key} BETWEEN ${first} AND ${last} `;
			}
		} else if (typeof value === "string") {
			if (value.startsWith("IN")) {
				value = value.substring(2);
				condition = `${key} IN (${value}::int[])`;
			}
			if (value.startsWith(">=")) {
				condition = `${key} ${value}`;
				value = value.substring(2);
			} else if (value.startsWith("<=")) {
				condition = `${key} ${value}`;
				value = value.substring(2);
			} else if (value.startsWith("<>")) {
				condition = `${key} ${value}`;
				value = value.substring(2);
			} else if (value.startsWith(">")) {
				condition = `${key} ${value}`;
				value = value.substring(1);
			} else if (value.startsWith("<")) {
				condition = `${key} ${value}`;
				value = value.substring(1);
			} else if (value.includes("*") || value.includes("?")) {
				value = value.replace(/\*/g, "%").replace(/\?/g, "_");
				condition = `${key} ILIKE '${value}'`;
			} else {
				condition = `${key} = '${value}'`;
			}
		}
		i++;

		args.push(value);
		clause = clause ? `${clause} AND ${condition}` : condition;
	}

	return { clause, args };
};

type WhereExistParam<T = Record<string, WhereParams>> = {
	[K in keyof T]?: WhereParams<T>;
};
// const whereExist = (conditions: WhereExistParam) => {
// 	let clause: string | undefined;

// 	for (const key in conditions) {
// 		let condition = "EXISTS ";
// 		condition += `SELECT * FROM ${key}`;
// 		const whereResult = where(conditions[key] as WhereParams);
// 		condition += ` WHERE ${whereResult.clause} `;
// 		clause = clause ? `${clause} AND ${condition}` : condition;
// 	}

// 	return clause;
// };

type JoinOnParam = { mainTable: string; joinTable: keyof ModelMap };

// function joinOn(params: JoinOnParam) {
// 	const { joinTable, mainTable } = params;
// 	const enums = Enums;

// 	const result: {
// 		joinTable: keyof ModelMap;
// 		result: string[];
// 	} = { joinTable, result: [] };

// 	if (
// 		Object.keys(enums[joinTable]).includes(
// 			mainTable.toLocaleLowerCase() + `Id`,
// 		)
// 	) {
// 		result.result.push(
// 			`"${joinTable}"."${mainTable.toLocaleLowerCase()}Id"`,
// 			`"${mainTable}"."id"`,
// 		);
// 	} else {
// 		result.result.push(
// 			`"${joinTable}"."id"`,
// 			`"${mainTable}"."${joinTable.toLocaleLowerCase()}Id"`,
// 		);
// 	}
// 	return result;
// }

type Condition = { start: string; end: string };
type GroupOrSingle = Condition | Condition[];

const typeJoinMap = new Map([
	["LEFT", " LEFT JOIN "],
	["INNER", " INNER JOIN "],
	[undefined, " JOIN "],
]);

export class SqlSelect<M, K extends keyof ModelMap> {
	private tableConfig: string;
	private whereConfig?: string;
	private whereExistsConfig: string[];
	private orderByConfig?: string[];
	private limitConfig?: number;
	private offsetConfig?: number;
	private selectConfig: string[];
	private joinConfig: string[];
	private groupByConfig?: string;
	private includeConfig: {
		table: string;
		include: string;
		join: string;
	}[] = [];

	constructor(
		table: Prisma.ModelName,
		private readonly prisma: PrismaService,
	) {
		this.whereExistsConfig = [];
		this.tableConfig = table;
		this.whereConfig = undefined;
		this.orderByConfig = undefined;
		this.limitConfig = undefined;
		this.offsetConfig = undefined;
		this.selectConfig = [`"${table}".*`];
		this.joinConfig = [];
		this.includeConfig = [];
		this.groupByConfig = undefined;
	}

	private existBuild(
		conditions: Record<string, any>,
		parentsTable: string = this.tableConfig,
	) {
		let clause: string | undefined;
		const arr: GroupOrSingle = [];

		for (const key in conditions) {
			const conditionsObj = conditions[key];

			let condition = "EXISTS (";
			const { result } = this.resolveJoinKeys({
				joinTable: key as keyof ModelMap,
				mainTable: parentsTable,
			});
			condition += `SELECT * FROM "${key}"`;

			const whereObj = {};
			for (const keyConditionsObj in conditionsObj) {
				const matchedKey = checkTwoArraysForCompatibility(
					Object.keys(conditionsObj),
					Object.keys(Prisma.ModelName),
				);

				if (matchedKey && conditionsObj[matchedKey]) {
					const result = this.existBuild(
						{
							[matchedKey]: conditionsObj[matchedKey],
						},
						key,
					);

					arr.push(
						...result.map((data) => ({
							start: `${data.start}`,
							end: data.end,
						})),
					);
					continue;
				}

				whereObj[`"${key}"."${keyConditionsObj}"`] =
					conditionsObj[keyConditionsObj];
			}

			const whereResult = whereBuild(whereObj as WhereParams);
			condition += ` WHERE ${result.join(" = ")} AND ${whereResult.clause} `;
			clause = clause ? `${clause} AND ${condition}` : condition;

			arr.push({ start: clause, end: ")" });
		}

		return arr;
	}

	private hasForeignKey(joinTable: string, mainTable: string) {
		return Object.keys(Enums[joinTable]).includes(
			mainTable.charAt(0).toLocaleLowerCase() + mainTable.slice(1) + `Id`,
		);
	}
	private resolveJoinKeys(params: JoinOnParam) {
		const { joinTable, mainTable } = params;
		const hasForeignKey = this.hasForeignKey(joinTable, mainTable);
		const result: {
			joinTable: keyof ModelMap;
			result: string[];
		} = { joinTable, result: [] };

		if (hasForeignKey) {
			result.result.push(
				`"${joinTable}"."${mainTable.charAt(0).toLocaleLowerCase() + mainTable.slice(1)}Id"`,
				`"${mainTable}"."id"`,
			);
		} else {
			result.result.push(
				`"${joinTable}"."id"`,
				`"${mainTable}"."${joinTable.charAt(0).toLocaleLowerCase() + joinTable.slice(1)}Id"`,
			);
		}
		return result;
	}
	private joinBuild(params: { table: keyof ModelMap }) {
		const joinCondition = this.resolveJoinKeys({
			joinTable: params.table,
			mainTable: this.tableConfig,
		});
		const [keyJoin, valJoin] = joinCondition.result;
		return ` LEFT JOIN "${params.table}" ON ${valJoin} = ${keyJoin} `;
	}

	include(params: Include[K & keyof Include]) {
		const includeConfig: Array<{
			table: string;
			include: string;
			join: string;
		}> = [];

		for (const key in params) {
			const join = this.joinBuild({ table: key as keyof ModelMap });

			this.joinConfig.push(join);
			const hasForeignKey = this.hasForeignKey(key, this.tableConfig);
			if (hasForeignKey) {
				const include: string = `json_agg(json_build_object(
                    ${Object.keys(params[key as string])
						.map((data) => `'${data}', "${key}"."${data}"`)
						.join(", ")}
                    ))`;

				includeConfig.push({
					table: key,
					include,
					join,
				});
				this.groupByConfig = `GROUP BY "${this.tableConfig}"."id"`;
			} else {
				const include: string = `json_build_object(
                    ${Object.keys(params[key as string])
						.map((data) => `'${data}', "${key}"."${data}" `)
						.join(", ")}
                    )`;

				includeConfig.push({
					table: key,
					include,
					join,
				});
			}
		}
		this.includeConfig = includeConfig;
		return this;
	}

	whereExist(params: Record<string, any>) {
		let clause: string | undefined;

		const exist = this.existBuild(params);

		let end = "";
		const start = exist.reduceRight((acc, curr) => {
			end += curr.end;
			return (acc += curr.start);
		}, "");

		clause = clause ? `${clause} AND ${start}${end} ` : `${start}${end}`;

		this.whereExistsConfig.push(clause);
		return this;
	}

	where(conditions: Where[K]) {
		const whereObj: WhereParams<M> = {};

		for (const key in conditions) {
			if (!key || !conditions[key]) continue;

			if (Array.isArray(conditions[key])) {
				for (const element of conditions[key]) {
					this.where(element);
				}
				continue;
			}

			if (!Object.keys(Prisma.ModelName).includes(key)) {
				if (key.includes("ROUND")) {
					whereObj[`${key}` as string] = conditions[key];
					continue;
				}

				whereObj[`"${this.tableConfig}"."${key}"` as string] =
					conditions[key];
			} else {
				this.whereExist({ [key]: conditions[key] });
			}
		}
		const { clause } = whereBuild(whereObj);
		this.whereConfig = clause;
		return this;
	}

	orderBy(object: OrderByParam<M>) {
		const arr = Object.entries(object).map(([key, val]) => {
			return `"${key}" ${val}`;
		});
		this.orderByConfig = [arr.join(", ")];
		return this;
	}
	limit(limit: number) {
		this.limitConfig = limit;

		return this;
	}
	offset(offset: number) {
		this.offsetConfig = offset;

		return this;
	}
	select(select: { [K in keyof M]?: boolean }) {
		if (!select) return;
		const selectKey = Object.keys(select);

		const currFields = selectKey.map((value) => {
			// if ((value as string).includes("ROUND")) return value as string;
			if ((value as string).includes("*"))
				return `"${this.tableConfig}".${value as string}`;
			if ((value as string).includes('"')) return value as string;

			return `"${value as string}"`;
		});

		this.selectConfig = currFields as Array<string>;
		return this;
	}

	async query() {
		const {
			joinConfig,
			tableConfig,
			selectConfig: fieldsConfig,
			limitConfig,
			offsetConfig,
			orderByConfig,
			whereExistsConfig,
			whereConfig,
			includeConfig,
			groupByConfig,
		} = this;

		let sql = `SELECT ${this.selectConfig}`;
		if (includeConfig.length > 0) {
			sql += `, ${includeConfig
				.map(
					(data) =>
						`CASE WHEN COUNT("${data.table}"."id") = 0 THEN NULL ELSE ${data.include} END AS "${data.table}" `,
				)
				.join(", ")}`;
		}
		sql += `FROM "${tableConfig}"`;
		if (joinConfig) sql += joinConfig.join(" ");

		const whereExist = whereExistsConfig.join(" AND ");

		if (whereConfig && whereExist) {
			sql += ` WHERE ${whereConfig} AND ${whereExist} `;
		} else if (!whereConfig && whereExist) {
			sql += ` WHERE ${whereExist} `;
		} else if (whereConfig && !whereExist) {
			sql += ` WHERE ${whereConfig} `;
		}

		if (groupByConfig) sql += ` ${groupByConfig} `;

		sql += orderByConfig
			? ` ORDER BY ${orderByConfig.join(" ")} NULLS LAST `
			: ` ORDER BY "${tableConfig}"."id" ASC `;

		if (limitConfig && !Number.isNaN(+limitConfig))
			sql += ` LIMIT ${limitConfig} `;
		if (offsetConfig) sql += ` OFFSET ${offsetConfig} `;

		return await this.prisma.$queryRawUnsafe<M[]>(sql);
	}
}

export class SqlDelete<T> {
	private supportedMapTypes: Map<
		string,
		(key: any, id: any) => Promise<any>
	> = new Map();

	private whereConfig: string;
	private table: Prisma.ModelName;

	constructor(
		table: Prisma.ModelName,
		private readonly prisma: PrismaService,
	) {
		this.whereConfig = "";
		this.table = table;
	}

	where(conditions: WhereParams<T>) {
		const { clause } = whereBuild(conditions);
		if (!clause) return;
		this.whereConfig = clause;
		return this;
	}

	async query() {
		let sql = `DELETE ${this.table}`;
		sql += this.whereConfig;

		return (await this.prisma.$queryRawUnsafe(``)) as T;
	}
}

export class SqlCount<T, K extends keyof ModelMap> {
	private enum: ModelMap[K];

	protected tableConfig: string;
	private whereConfig?: string;
	private whereExistsConfig: string[];
	protected fieldsConfig: string[];
	protected joinConfig: string[];

	constructor(
		table: Prisma.ModelName,
		private readonly prisma: PrismaService,
	) {
		this.whereExistsConfig = [];
		this.joinConfig = [];
		this.tableConfig = table;
		this.whereConfig = undefined;
		this.fieldsConfig = [` "${table}".*`];
	}

	private existBuild(
		conditions: Record<string, any>,
		parentsTable: string = this.tableConfig,
	) {
		let clause: string | undefined;
		const arr: GroupOrSingle = [];

		for (const key in conditions) {
			const conditionsObj = conditions[key];

			let condition = "EXISTS (";
			const { result } = this.resolveJoinKeys({
				joinTable: key as keyof ModelMap,
				mainTable: parentsTable,
			});
			condition += `SELECT * FROM "${key}"`;

			const whereObj = {};
			for (const keyConditionsObj in conditionsObj) {
				const matchedKey = checkTwoArraysForCompatibility(
					Object.keys(conditionsObj),
					Object.keys(Prisma.ModelName),
				);

				if (matchedKey && conditionsObj[matchedKey]) {
					const result = this.existBuild(
						{
							[matchedKey]: conditionsObj[matchedKey],
						},
						key,
					);

					arr.push(
						...result.map((data) => ({
							start: `${data.start}`,
							end: data.end,
						})),
					);
					continue;
				}

				whereObj[`"${key}"."${keyConditionsObj}"`] =
					conditionsObj[keyConditionsObj];
			}

			const whereResult = whereBuild(whereObj as WhereParams);
			condition += ` WHERE ${result.join(" = ")} AND ${whereResult.clause} `;
			clause = clause ? `${clause} AND ${condition}` : condition;

			arr.push({ start: clause, end: ")" });
		}

		return arr;
	}

	private hasForeignKey(joinTable: string, mainTable: string) {
		return Object.keys(Enums[joinTable]).includes(
			mainTable.charAt(0).toLocaleLowerCase() + mainTable.slice(1) + `Id`,
		);
	}
	private resolveJoinKeys(params: JoinOnParam) {
		const { joinTable, mainTable } = params;
		const hasForeignKey = this.hasForeignKey(joinTable, mainTable);
		const result: {
			joinTable: keyof ModelMap;
			result: string[];
		} = { joinTable, result: [] };

		if (hasForeignKey) {
			result.result.push(
				`"${joinTable}"."${mainTable.charAt(0).toLocaleLowerCase() + mainTable.slice(1)}Id"`,
				`"${mainTable}"."id"`,
			);
		} else {
			result.result.push(
				`"${joinTable}"."id"`,
				`"${mainTable}"."${joinTable.charAt(0).toLocaleLowerCase() + joinTable.slice(1)}Id"`,
			);
		}
		return result;
	}
	private joinBuild(params: { table: keyof ModelMap }) {
		const joinCondition = this.resolveJoinKeys({
			joinTable: params.table,
			mainTable: this.tableConfig,
		});
		const [keyJoin, valJoin] = joinCondition.result;
		return ` LEFT JOIN "${params.table}" ON ${valJoin} = ${keyJoin} `;
	}

	whereExist(
		params: Record<string, any>,
		parentsTable: string = this.tableConfig,
	) {
		let clause: string | undefined;

		const exist = this.existBuild(params);

		let end = "";

		const start = exist.reduceRight((acc, curr) => {
			end += curr.end;
			return (acc += curr.start);
		}, "");

		clause = clause ? `${clause} AND ${start}${end} ` : `${start}${end}`;

		this.whereExistsConfig.push(clause);
		return this;
	}

	where(conditions: Where[K]) {
		const whereObj: WhereParams<T> = {};

		for (const key in conditions) {
			if (!key || !conditions[key]) continue;

			if (Array.isArray(conditions[key])) {
				for (const element of conditions[key]) {
					this.where(element);
				}
				continue;
			}

			if (!Object.keys(Prisma.ModelName).includes(key)) {
				if (key.includes("ROUND")) {
					whereObj[`${key}` as string] = conditions[key];
					continue;
				}

				whereObj[`"${this.tableConfig}"."${key}"` as string] =
					conditions[key];
			} else {
				this.whereExist({ [key]: conditions[key] });
			}
		}
		const { clause } = whereBuild(whereObj);
		this.whereConfig = clause;
		return this;
	}

	fields(fields: Array<keyof T> | Array<string> = []) {
		const currFields = fields.map((value) => {
			if ((value as string).includes("ROUND")) return value as string;
			if ((value as string).includes("*"))
				return `"${this.tableConfig}".${value as string}`;
			if ((value as string).includes('"')) return value as string;

			return `"${value as string}"`;
		});

		this.fieldsConfig = currFields as Array<string>;
		return this;
	}

	async query() {
		const {
			fieldsConfig,
			tableConfig,
			whereConfig,
			whereExistsConfig,
			joinConfig,
		} = this;

		let sql = `SELECT COUNT(*) FROM "${tableConfig}" `;
		if (joinConfig) sql += joinConfig.join(" ");

		const whereExist = whereExistsConfig.join(" AND ");
		if (whereConfig && whereExist) {
			sql += ` WHERE ${whereConfig} AND ${whereExist} `;
		} else if (!whereConfig && whereExist) {
			sql += ` WHERE ${whereExist} `;
		} else if (whereConfig && !whereExist) {
			sql += ` WHERE ${whereConfig} `;
		}
		const count = (
			await this.prisma.$queryRawUnsafe<Array<{ count: BigInt }>>(sql)
		).map((data) => Number(data.count))[0];

		return count;
	}
}
