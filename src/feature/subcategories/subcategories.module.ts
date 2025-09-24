import { Module } from "@nestjs/common";
import { SubcategoriesControllers } from "./subcategories.controller";
import { SubcategoriesService } from "./subcategories.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { QueryModule } from "src/query/query.module";

@Module({
	imports: [PrismaModule, QueryModule],
	controllers: [SubcategoriesControllers],
	providers: [SubcategoriesService],
	exports: [SubcategoriesService],
})
export class SubcategoriesModule {}
