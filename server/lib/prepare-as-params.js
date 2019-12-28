import { v4 as uuid } from 'uuid';

import { isObjectWithKeys } from './is-object-with-keys';

export const prepareAsParams = instance => {

	return Object.keys(instance).reduce((accumulator, key) => {

		if (isObjectWithKeys(instance[key])) {

			accumulator[key] = prepareAsParams(instance[key]);

		} else if (Array.isArray(instance[key])) {

			accumulator[key] =
				instance[key]
					.filter(item => !item.hasOwnProperty('name') || !!item.name.length)
					.map((item, index) => {

						if (isObjectWithKeys(item)) {

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
