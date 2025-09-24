import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { AttributeDefinitionsController } from "./attributeDefinitions.controller";
import { AttributeDefinitionsService } from "./attributeDefinitions.service";
import { ProductsModule } from "../products/products.module";
import { QueryModule } from "src/query/query.module";

@Module({
	imports: [PrismaModule, ProductsModule, QueryModule],
	controllers: [AttributeDefinitionsController],
	providers: [AttributeDefinitionsService],
	exports: [AttributeDefinitionsService],
})
export class AttributeDefinitionsModule {}
