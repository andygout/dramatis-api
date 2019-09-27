import { isObject } from './is-object';

const isErrorsProperty = (prop, value) => prop === 'errors' && isObject(value);

const isObjectWithErrors = item => isObject(item) && verifyErrorPresence(item);

export const verifyErrorPresence = instance => {

	for (const prop in instance) if (instance.hasOwnProperty(prop)) {

		const value = instance[prop];

		if (isErrorsProperty(prop, value)) return true;

		if (isObjectWithErrors(value)) return true;

		if (Array.isArray(value) && value.find(item => isObjectWithErrors(item))) return true;

	}

	return false;

};
