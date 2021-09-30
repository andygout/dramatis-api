import { randomUUID } from 'crypto';

import neo4j from 'neo4j-driver';

import { isObjectWithKeys } from './is-object-with-keys';

const CHARACTER_GROUPS = 'characterGroups';
const CREATIVE_CREDITS = 'creativeCredits';
const CREW_CREDITS = 'crewCredits';
const NOMINATIONS = 'nominations';
const PRODUCER_CREDITS = 'producerCredits';
const WRITING_CREDITS = 'writingCredits';

const EMPTY_NAME_EXCEPTION_KEYS = new Set([
	CHARACTER_GROUPS,
	NOMINATIONS,
	PRODUCER_CREDITS,
	WRITING_CREDITS
]);

const REQUIRES_NAMED_CHILDREN_KEYS = new Set([
	CHARACTER_GROUPS,
	CREATIVE_CREDITS,
	CREW_CREDITS,
	NOMINATIONS,
	PRODUCER_CREDITS,
	WRITING_CREDITS
]);

export const prepareAsParams = instance => {

	const recordedInstances = [];

	const hasNameOrIsExempt = key => item =>
		Boolean(item.name) ||
		EMPTY_NAME_EXCEPTION_KEYS.has(key);

	const hasNamedChildrenIfRequired = key => item =>
		!REQUIRES_NAMED_CHILDREN_KEYS.has(key) ||
		item[key === CHARACTER_GROUPS ? 'characters' : 'entities']?.some(child => Boolean(child.name));

	const applyPositionPropertyAndRecurseObject = (item, index, array) => {

		if (isObjectWithKeys(item)) {

			if (array.length > 1) item = { ...item, model: item.model, position: index };

			return applyModifications(item);

		}

		return null;

	};

	const applyModifications = instance => {

		return Object.keys(instance).concat(['model']).reduce((accumulator, key) => {

			const value = instance[key];

			if (isObjectWithKeys(value)) {

				accumulator[key] = applyModifications(value);

			} else if (Array.isArray(value)) {

				accumulator[key] =
					value
						.filter(hasNameOrIsExempt(key))
						.filter(hasNamedChildrenIfRequired(key))
						.map(applyPositionPropertyAndRecurseObject)
						.filter(Boolean);

			} else {

				const requiresUuidValue =
					key === 'uuid' &&
					(value === undefined || !value.length);

				if (requiresUuidValue) {

					const instanceWithShareableUuid = recordedInstances.find(recordedInstance =>
						instance.model === recordedInstance.model &&
						instance.name === recordedInstance.name &&
						instance.differentiator === recordedInstance.differentiator
					);

					accumulator[key] = instanceWithShareableUuid?.uuid || randomUUID({ disableEntropyCache: true });

					if (!instanceWithShareableUuid) {

						recordedInstances.push({
							model: instance.model,
							uuid: accumulator[key],
							name: instance.name,
							differentiator: instance.differentiator
						});

					}

				}
				else if (typeof value === 'number') accumulator[key] = neo4j.int(value);
				else if (value === '') accumulator[key] = null;
				else accumulator[key] = value;

			}

			return accumulator;

		}, {});

	};

	return applyModifications(instance);

};
