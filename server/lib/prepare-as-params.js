import { v4 as uuid } from 'uuid';

import propIsObject from './prop-is-object';

const prepareAsParams = instance => {

	for (const prop in instance) if (instance.hasOwnProperty(prop)) {

		if (propIsObject(instance[prop])) {

			instance[prop] = prepareAsParams(instance[prop]);

		} else if (Array.isArray(instance[prop])) {

			instance[prop].forEach((item, index) => {

				if (propIsObject(item)) {

					item.position = index;

					prepareAsParams(item);

				}

			});

		} else {

			if (prop === 'uuid' && (instance[prop] === undefined || !instance[prop].length)) instance[prop] = uuid();

		}

	}

	return instance;

};

export default instance => prepareAsParams(instance);
