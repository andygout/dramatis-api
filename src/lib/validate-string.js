export const validateString = (stringValue, isRequiredString) => {

	const STRING_MAX_LENGTH = 1000;

	let errorText;

	const isStringWithLength =
		stringValue !== null &&
		!!stringValue.length;

	if (isRequiredString && !isStringWithLength) errorText = 'Name is too short';

	const isStringExceedingMaxLength =
		isStringWithLength &&
		stringValue.length > STRING_MAX_LENGTH;

	if (isStringExceedingMaxLength) errorText = 'Name is too long';

	return errorText;

};
