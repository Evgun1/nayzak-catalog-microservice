import { CategoryCacheDTO } from "../dto/categoriesGapCache.dto";

export interface CategoriesCacheParam
	extends Pick<CategoryCacheDTO, "id" | "Media" | "title"> {}
