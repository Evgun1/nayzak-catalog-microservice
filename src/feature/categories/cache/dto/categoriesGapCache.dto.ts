import { CategoriesCacheParam } from "../interface/categoriesGapDto.interface";

export class CategoryCacheDTO {
	id: number;
	title: string;
	Media: { src: string; name: string };
	createdCacheAt: Date;

	constructor(param: Pick<CategoryCacheDTO, "Media" | "id" | "title">) {
		this.id = param.id;
		this.title = param.title;
		this.Media = param.Media;
		this.createdCacheAt = new Date();
	}
}
