import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Prisma, PrismaClient } from "@prisma/client";
import { SqlCount, SqlDelete, SqlSelect } from "./prisma-sql-builder";
import { ModelMap } from "./interface/modelMap.type";

@Injectable()
export class PrismaService
	extends PrismaClient
	implements OnModuleInit, OnModuleDestroy
{
	async onModuleInit() {
		await this.$connect();
	}
	async onModuleDestroy() {
		await this.$disconnect();
	}

	async sqlQuery<T extends keyof ModelMap>(table: T) {
		return {
			count: new SqlCount<ModelMap[T], T>(table, this),
			find: new SqlSelect<ModelMap[T], T>(table, this),
			delete: new SqlDelete<ModelMap[T]>(table, this),
		};
	}
}
