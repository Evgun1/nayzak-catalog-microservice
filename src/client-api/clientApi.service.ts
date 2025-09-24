import { HttpClientService } from "./httpClient.service";
import { HttpException, Injectable, RequestMethod } from "@nestjs/common";
import { TagsItem } from "./interface/tagsItem.interface";

@Injectable()
export class ClientApiService {
	constructor(private readonly httpClientService: HttpClientService) {}

	async clearCache(tag: keyof TagsItem) {
		const pathname = "revalidate";
		const body = { tag };
		const authorization = "cache-secret-key";

		console.log("clear cache");

		return await this.httpClientService.fetchPost({
			pathname,
			body,
			authorization,
		});
	}
}
