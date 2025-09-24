import { Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
export default (async function start() {
	const prisma = new PrismaService();

	await prisma.$connect();
	for (const key in Prisma.ModelName) {
		// @ts-ignore
		prisma[key].deleteMany({});
	}
	await prisma.$disconnect();
})();
