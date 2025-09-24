import { Module } from "@nestjs/common";
import { CategoriesController } from "./categories.controller";
import { CategoriesService } from "./categories.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { QueryModule } from "src/query/query.module";
import { RedisModule } from "src/redis/redis.module";
import { ClientApiModule } from "src/client-api/clientApi.module";

@Module({
	imports: [PrismaModule, QueryModule, RedisModule, ClientApiModule],
	controllers: [CategoriesController],
	providers: [CategoriesService],
	exports: [CategoriesService],
})
export class CategoriesModule {}
