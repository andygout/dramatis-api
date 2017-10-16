import propIsObject from './prop-is-object';

const trimStrings = instance => {

	for (const prop in instance) if (instance.hasOwnProperty(prop)) {

		if (propIsObject(instance[prop])) {

			instance[prop] = trimStrings(instance[prop]);

		} else if (Array.isArray(instance[prop])) {

			instance[prop].forEach(item => { if (propIsObject(item)) trimStrings(item); });

		} else {

			if (typeof instance[prop] === 'string') instance[prop] = instance[prop].trim();

		}

	}

	return instance;

};

export default instance => trimStrings(instance);
