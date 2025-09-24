import { AwaitExpression } from "./../node_modules/@types/estree/index.d";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { Next, ValidationPipe } from "@nestjs/common";
const PORT = process.env.PORT ?? 3000;

async function bootstrap() {
	const app = await NestFactory.create(AppModule, { cors: true });
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
		}),
	);

	app.connectMicroservice<MicroserviceOptions>({
		transport: Transport.KAFKA,
		options: {
			client: {
				clientId: "catalog-service",
				brokers: ["localhost:29092", "localhost:39092"],
			},
			consumer: {
				groupId: "catalog-consumer",
			},
			// 	rebalanceTimeout: 60000,
			// 	allowAutoTopicCreation: false,
			// 	heartbeatInterval: 3000,
			// 	sessionTimeout: 45000,
			// 	retry: {
			// 		initialRetryTime: 300,
			// 		retries: 5,
			// 	},
			// },
			// subscribe: { fromBeginning: true },
		},
	});
	await app.startAllMicroservices();

	app.enableCors({
		origin: ["http://localhost:2999", "http://localhost:2998"],
		credentials: true,
	});
	// app.enableCors({
	// 	origin: "http://localhost:2998",
	// 	credentials: true,
	// });

	await app.listen(PORT, () => {
		console.log(`Server running on port: ${PORT}`);
	});
}
bootstrap();
