import { Module } from "@nestjs/common";
import { ClientApiService } from "./clientApi.service";
import { HttpClientService } from "./httpClient.service";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
	providers: [ClientApiService, HttpClientService],
	exports: [ClientApiService, HttpClientService],
})
export class ClientApiModule {}
