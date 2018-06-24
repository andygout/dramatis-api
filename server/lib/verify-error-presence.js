import propIsObject from './prop-is-object';

const hasErrors = (prop, value) => prop === 'errors' && propIsObject(value);

const objectWithErrors = item => propIsObject(item) && searchForErrors(item);

const searchForErrors = instance => {

	for (const prop in instance) if (instance.hasOwnProperty(prop)) {

		const value = instance[prop];

		if (hasErrors(prop, value)) return true;

		if (objectWithErrors(value)) return true;

		if (Array.isArray(value) && value.find(item => objectWithErrors(item))) return true;

	}

	return false;

};

export default instance => searchForErrors(instance);
