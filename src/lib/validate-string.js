export const validateString = (stringValue, isRequiredString) => {

	const STRING_MAX_LENGTH = 1000;

	const stringErrors = [];

	const isStringWithLength =
		stringValue !== null &&
		!!stringValue.length;

	if (isRequiredString && !isStringWithLength) stringErrors.push('Name is too short');

	const isStringExceedingMaxLength =
		isStringWithLength &&
		stringValue.length > STRING_MAX_LENGTH;

	if (isStringExceedingMaxLength) stringErrors.push('Name is too long');

	return stringErrors;

};
