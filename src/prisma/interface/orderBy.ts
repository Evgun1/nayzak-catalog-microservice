export type OrderByParam<T> = {
	[K in keyof T as T[K] extends Number ? K : never]?: "ASC" | "DESC";
};
