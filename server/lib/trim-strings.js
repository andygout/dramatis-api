import isObject from './is-object';

const trimStrings = instance => {

	Object.entries(instance).forEach(([prop, value]) => {

		if (isObject(value)) {

			instance[prop] = trimStrings(value);

		} else if (Array.isArray(value)) {

			value.forEach(item => { if (isObject(item)) trimStrings(item); });

		} else {

			if (typeof value === 'string') instance[prop] = value.trim();

		}

	});

	return instance;

};

export default instance => trimStrings(instance);
