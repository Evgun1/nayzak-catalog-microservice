export class ProductsKafkaDTO {
	id: number;
	price: number;
	discount: number;
	constructor(params: ProductsKafkaDTO) {
		for (const key in params) {
			if (!Object.keys(this).includes(key)) continue;
			this[key] = params[key];
		}
	}
}
