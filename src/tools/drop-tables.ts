import { PrismaService } from "../../src/prisma/prisma.service";
import { Prisma } from "@prisma/client";

async function start() {
	const prisma = new PrismaService();

	await prisma.$connect();

	for (const key in Prisma.ModelName) {
		await prisma.$queryRawUnsafe(`DROP TABLE "${key}" cascade `);
	}

	await prisma.$disconnect();
}

start();
