export const isObjectWithKeys = value =>
	Object(value) === value &&
	!Array.isArray(value) &&
	Object.keys(value).length > 0;
