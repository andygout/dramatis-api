export const isObject = value =>
	Object(value) === value &&
	!Array.isArray(value) &&
	Object.keys(value).length > 0;
