import { $Enums } from "@prisma/client";
import { Module } from "@nestjs/common";
import { redisProvider } from "./redisProvider";
import { RedisService } from "./redis.service";

@Module({
	providers: [redisProvider, RedisService],
	exports: [RedisService],
})
export class RedisModule {}
