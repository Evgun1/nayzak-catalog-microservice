export class PopularProductsCacheDTO {
	quantity: number;
	createAt: Date;
	updateAt: Date;

	constructor(quantity: number) {
		this.quantity = quantity;
		this.createAt = new Date();
		this.updateAt = new Date();
	}
}
