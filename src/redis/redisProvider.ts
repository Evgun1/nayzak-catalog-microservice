export const REDIS_CLIENT = "REDIS_CLIENT";

import { Provider } from "@nestjs/common";
import { createClient } from "redis";

export const redisProvider: Provider = {
	provide: REDIS_CLIENT,
	useFactory: async () => {
		const client = createClient({
			socket: {
				host: "0.0.0.0",
				port: 5454,
			},
			password: "nayzak",
		});
		await client.connect();
		return client;
	},
};
