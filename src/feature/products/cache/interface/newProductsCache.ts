import { NewProductsCacheDTO } from "../dto/newProductsCache.dto";

export interface NewProductsCacheParam
	extends Pick<
		NewProductsCacheDTO,
		"id" | "title" | "price" | "discount" | "createdAt" | "Media"
	> {}
