import { Inject, Injectable } from "@nestjs/common";
import { RedisClientType } from "redis";

@Injectable()
export class RedisService {
	constructor(
		@Inject("REDIS_CLIENT") private readonly client: RedisClientType,
	) {}

	redis() {
		return this.client;
	}

	async set<T>(key: string, value: T, second?: number) {
		const options:
			| {
					expiration?: {
						type: "EX" | "PX";
						value: number;
					};
			  }
			| undefined = {};

		if (second) {
			options.expiration = { type: "EX", value: second };
		}

		return await this.client.set(key, JSON.stringify(value as T), options);
	}

	async expire(key: string, second: number) {
		return await this.client.expire(key, second);
	}

	async get<T>(key: string) {
		const result = await this.client.get(key);
		return result ? (JSON.parse(result) as T) : null;
	}

	async del(key: string) {
		await this.client.del(key);
	}

	async hGet<T>(key: string, field: string | number) {
		const result = await this.client.hGet(key, field.toString());
		return result ? (JSON.parse(result) as T) : null;
	}
	async hGetAll<T>(key: string) {
		const result = await this.client.hGetAll(key).then((data: object) => {
			return Object.entries(data).map(([key, val]) => {
				return { [key]: JSON.parse(val) };
			});
		});
		return result as Array<{ [actionLink: string]: T }>;
	}
	async hSet<T>(key: string, args: { [key: string]: T }) {
		const value = Object.entries(args)
			.map(([key, value]) => ({
				[key]: JSON.stringify(value),
			}))
			.reduce((acc, cur) => ({ ...acc, ...cur }));

		return await this.client.hSet(key, value);
	}

	async hDel(key: string, field: string | string[] | number | number[]) {
		await this.client.hDel(
			key,
			typeof field === "object"
				? field.map((data: string | number) => data.toString())
				: field.toString(),
		);
	}

	async ttl<T>(key: string) {
		return await this.client.ttl(key);
	}

	async hDelAll() {}

	async customParam() {}
}
