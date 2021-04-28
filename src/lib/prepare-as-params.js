import neo4j from 'neo4j-driver';
import { v4 as uuid } from 'uuid';

import { isObjectWithKeys } from './is-object-with-keys';

const CHARACTER_GROUPS = 'characterGroups';
const PRODUCER_CREDITS = 'producerCredits';
const WRITING_CREDITS = 'writingCredits';

const EMPTY_NAME_EXCEPTION_KEYS = [
	CHARACTER_GROUPS,
	PRODUCER_CREDITS,
	WRITING_CREDITS
];

export const prepareAsParams = instance => {

	const recordedInstances = [];

	const hasNameOrIsExempt = key => item =>
		!Object.prototype.hasOwnProperty.call(item, 'name')
		|| Boolean(item.name)
		|| EMPTY_NAME_EXCEPTION_KEYS.includes(key);

	const isNotWritingCreditWithoutNamedEntity = key => item =>
		key !== WRITING_CREDITS || item.entities.some(entity => Boolean(entity.name));

	const isNotCharacterGroupWithoutNamedCharacter = key => item =>
		key !== CHARACTER_GROUPS || item.characters.some(character => Boolean(character.name));

	const isNotProducerCreditWithoutNamedEntity = key => item =>
		key !== PRODUCER_CREDITS || item.entities.some(entity => Boolean(entity.name));

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
						.filter(isNotWritingCreditWithoutNamedEntity(key))
						.filter(isNotCharacterGroupWithoutNamedCharacter(key))
						.filter(isNotProducerCreditWithoutNamedEntity(key))
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
				else if (typeof value === 'number') accumulator[key] = neo4j.int(value);
				else if (value === '') accumulator[key] = null;
				else accumulator[key] = value;

			}

			return accumulator;

		}, {});

	};

	return applyModifications(instance);

};
