export default function toPlainObject(value) {
	if (Array.isArray(value)) {
		return value.map(toPlainObject);
	}

	if (value && typeof value === 'object') {
		return Object.fromEntries(Object.entries(value).map(([key, nestedValue]) => [key, toPlainObject(nestedValue)]));
	}

	return value;
}
