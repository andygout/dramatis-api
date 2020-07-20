import neo4j from 'neo4j-driver';
import { v4 as uuid } from 'uuid';

import { isObjectWithKeys } from './is-object-with-keys';

export const prepareAsParams = instance => {

	return Object.keys(instance).reduce((accumulator, key) => {

		if (isObjectWithKeys(instance[key])) {

			accumulator[key] = prepareAsParams(instance[key]);

		} else if (Array.isArray(instance[key])) {

			accumulator[key] =
				instance[key]
					.filter(item => !Object.prototype.hasOwnProperty.call(item, 'name') || !!item.name.length)
					.map((item, index, array) => {

						if (isObjectWithKeys(item)) {

							if (array.length > 1) item.position = index;

							return prepareAsParams(item);

						}

						return null;

					})
					.filter(Boolean);

		} else {

			const requiresUuidValue =
				key === 'uuid' &&
				(instance[key] === undefined || !instance[key].length);

			if (requiresUuidValue) accumulator[key] = uuid();
			else if (typeof instance[key] === 'number') accumulator[key] = neo4j.int(instance[key]);
			else if (instance[key] === '') accumulator[key] = null;
			else accumulator[key] = instance[key];

		}

		return accumulator;

	}, {});

};
