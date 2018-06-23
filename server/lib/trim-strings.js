import propIsObject from './prop-is-object';

const trimStrings = instance => {

	Object.entries(instance).forEach(([prop, value]) => {

		if (propIsObject(value)) {

			instance[prop] = trimStrings(value);

		} else if (Array.isArray(value)) {

			value.forEach(item => { if (propIsObject(item)) trimStrings(item); });

		} else {

			if (typeof value === 'string') instance[prop] = value.trim();

		}

	});

	return instance;

};

export default instance => trimStrings(instance);
