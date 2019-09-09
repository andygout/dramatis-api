import { isObject } from './is-object';

const hasErrors = (prop, value) => prop === 'errors' && isObject(value);

const objectWithErrors = item => isObject(item) && verifyErrorPresence(item);

export const verifyErrorPresence = instance => {

	for (const prop in instance) if (instance.hasOwnProperty(prop)) {

		const value = instance[prop];

		if (hasErrors(prop, value)) return true;

		if (objectWithErrors(value)) return true;

		if (Array.isArray(value) && value.find(item => objectWithErrors(item))) return true;

	}

	return false;

};
