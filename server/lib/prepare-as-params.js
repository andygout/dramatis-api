import { v4 as uuid } from 'uuid';

import isObject from './is-object';

const prepareAsParams = instance => {

	Object.entries(instance).forEach(([prop, value]) => {

		if (isObject(value)) {

			instance[prop] = prepareAsParams(value);

		} else if (Array.isArray(value)) {

			value.forEach((item, index) => {

				if (isObject(item)) {

					item.position = index;

					prepareAsParams(item);

				}

			});

		} else {

			if (prop === 'uuid' && (value === undefined || !value.length)) instance[prop] = uuid();

		}

	});

	return instance;

};

export default instance => prepareAsParams(instance);
