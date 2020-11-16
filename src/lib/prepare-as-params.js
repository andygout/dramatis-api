import neo4j from 'neo4j-driver';
import { v4 as uuid } from 'uuid';

import { isObjectWithKeys } from './is-object-with-keys';

const CHARACTER_GROUPS = 'characterGroups';
const WRITER_GROUPS = 'writerGroups';

const EMPTY_NAME_EXCEPTION_KEYS = [
	CHARACTER_GROUPS,
	WRITER_GROUPS
];

export const prepareAsParams = instance => {

	const recordedInstances = [];

	const filterBasedOnNameProperty = key => item =>
		!Object.prototype.hasOwnProperty.call(item, 'name')
		|| !!item.name.length
		|| EMPTY_NAME_EXCEPTION_KEYS.includes(key);

	const filterOutWriterGroupsWithNoNamedWriters = key => item =>
		key !== WRITER_GROUPS || item.writers.some(writer => !!writer.name);

	const filterOutCharacterGroupsWithNoNamedCharacters = key => item =>
		key !== CHARACTER_GROUPS || item.characters.some(character => !!character.name);

	const applyPositionPropertyAndRecurseObject = (item, index, array) => {

		if (isObjectWithKeys(item)) {

			if (array.length > 1) item = { ...item, position: index };

			return applyModifications(item);

		}

		return null;

	};

	const applyModifications = instance => {

		return Object.keys(instance).reduce((accumulator, key) => {

			if (isObjectWithKeys(instance[key])) {

				accumulator[key] = applyModifications(instance[key]);

			} else if (Array.isArray(instance[key])) {

				accumulator[key] =
					instance[key]
						.filter(filterBasedOnNameProperty(key))
						.filter(filterOutWriterGroupsWithNoNamedWriters(key))
						.filter(filterOutCharacterGroupsWithNoNamedCharacters(key))
						.map(applyPositionPropertyAndRecurseObject)
						.filter(Boolean);

			} else {

				const requiresUuidValue =
					key === 'uuid' &&
					(instance[key] === undefined || !instance[key].length);

				if (requiresUuidValue) {

					const instanceWithShareableUuid = recordedInstances.find(recordedInstance =>
						instance.model === recordedInstance.model &&
						instance.name === recordedInstance.name &&
						instance.differentiator === recordedInstance.differentiator
					);

					accumulator[key] = instanceWithShareableUuid?.uuid || uuid();

					if (!instanceWithShareableUuid) {

						recordedInstances.push({
							model: instance.model,
							uuid: accumulator[key],
							name: instance.name,
							differentiator: instance.differentiator
						});

					}

				}
				else if (typeof instance[key] === 'number') accumulator[key] = neo4j.int(instance[key]);
				else if (instance[key] === '') accumulator[key] = null;
				else accumulator[key] = instance[key];

			}

			return accumulator;

		}, {});

	};

	return applyModifications(instance);

};
