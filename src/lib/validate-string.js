export const validateString = (stringValue, opts) => {

	const STRING_MAX_LENGTH = 1000;

	let errorText;

	const isStringWithLength =
		stringValue !== null &&
		!!stringValue.length;

	if (opts.isRequiredString && !isStringWithLength) errorText = 'Name is too short';

	const isStringExceedingMaxLength =
		isStringWithLength &&
		stringValue.length > STRING_MAX_LENGTH;

	if (isStringExceedingMaxLength) errorText = 'Name is too long';

	return errorText;

};
