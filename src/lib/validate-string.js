export const validateString = (stringValue, opts) => {

	const STRING_MAX_LENGTH = 1000;

	let errorText;

	const isStringWithLength =
		stringValue !== null &&
		!!stringValue.length;

	if (opts.isRequired && !isStringWithLength) errorText = 'Value is too short';

	const isStringExceedingMaxLength =
		isStringWithLength &&
		stringValue.length > STRING_MAX_LENGTH;

	if (isStringExceedingMaxLength) errorText = 'Value is too long';

	return errorText;

};
