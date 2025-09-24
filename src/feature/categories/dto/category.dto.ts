export class CategoryDTO {
	id: number;
	title: string;
	Media: { src: string; name: string };

	constructor(item: CategoryDTO) {
		for (const key in item) {
			this[key] = item[key];
		}
	}
}
