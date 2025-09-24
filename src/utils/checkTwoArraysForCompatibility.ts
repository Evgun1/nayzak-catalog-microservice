export function checkTwoArraysForCompatibility(
	arrFirst: string[],
	arrSecond: string[],
) {
	const result = arrFirst.reduce((acc, cur) => {
		if (!arrSecond.includes(cur)) return;
		acc = cur;
		return acc;
	}, "");

	return result;
}
