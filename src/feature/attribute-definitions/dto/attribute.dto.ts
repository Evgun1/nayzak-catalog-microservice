import { Prisma } from "@prisma/client";

export class AttributeDTO {
	id: number;
	name: string;
	subcategoriesId: number;
	type: string;
	unit: string | null;
	active?: boolean = false;
	constructor(param: AttributeDTO) {
		for (const key in param) {
			if (!Object.keys(this).includes(key)) continue;
			this[key] = param[key];
		}
	}
}
