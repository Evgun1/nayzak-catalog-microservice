import { Injectable } from "@nestjs/common";

@Injectable()
export class HttpClientService {
	private url = "http://localhost:2999/api";
	private method = {
		get: "GET",
		post: "POST",
		delete: "DELETE",
		put: "PUT",
	};

	private async fetch({
		pathname,
		init,
	}: {
		pathname: string;
		init: RequestInit;
	}) {
		try {
			const url = `${this.url}/${pathname}`;
			const response = await fetch(url, init);

			console.log(url);

			const headers = response.headers;
			const result = await response.json();
			return { result, headers };
		} catch (error) {
			const err = error as Error;
			throw new Error(err.message, { cause: err.cause });
		}
	}

	async fetchGet(inputData: { pathname: string; authorization?: string }) {
		const { authorization, pathname } = inputData;

		const init: RequestInit = {};
		init.method = this.method.get;

		if (authorization) {
			init.headers = { Authorization: authorization };
		}
		return await this.fetch({ pathname, init });
	}

	async fetchPost(inputData: {
		pathname: string;
		authorization?: string;
		body: {};
	}) {
		const { authorization, body, pathname } = inputData;
		const init: RequestInit = {};

		if (authorization) {
			init.headers = { Authorization: authorization };
		}
		init.method = this.method.post;
		init.body = JSON.stringify(body);

		return await this.fetch({ pathname, init });
	}
}
