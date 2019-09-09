import { v4 as uuid } from 'uuid';

import { isObject } from './is-object';

export const prepareAsParams = instance => {

	return Object.keys(instance).reduce((accumulator, key) => {

		if (isObject(instance[key])) {

			accumulator[key] = prepareAsParams(instance[key]);

		} else if (Array.isArray(instance[key])) {

			accumulator[key] =
				instance[key]
					.map((item, index) => {

						if (isObject(item)) {

							item.position = index;

							return prepareAsParams(item);

						}

						return null;

					})
					.filter(Boolean);

		} else {

			accumulator[key] =
				(key === 'uuid' && (instance[key] === undefined || !instance[key].length))
					? uuid()
					: instance[key];

		}

		return accumulator;

	}, {});

};
