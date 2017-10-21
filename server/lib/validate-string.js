import constants from '../config/constants';

export default (stringValue, opts = {}) => {

	const stringErrors = [];

	if (stringValue === null) return stringErrors;

	if (opts.required && (stringValue.length < constants.STRING_MIN_LENGTH)) stringErrors.push('Name is too short');

	if (stringValue.length > constants.STRING_MAX_LENGTH) stringErrors.push('Name is too long');

	return stringErrors;

};
