import neo4j from 'neo4j-driver';
import { v4 as uuid } from 'uuid';

import { isObjectWithKeys } from './is-object-with-keys';

const CHARACTER_GROUPS = 'characterGroups';
const WRITING_CREDITS = 'writingCredits';

const EMPTY_NAME_EXCEPTION_KEYS = [
	CHARACTER_GROUPS,
	WRITING_CREDITS
];

export const prepareAsParams = instance => {

	const recordedInstances = [];

	const hasNameOrIsExempt = key => item =>
		!Object.prototype.hasOwnProperty.call(item, 'name')
		|| !!item.name.length
		|| EMPTY_NAME_EXCEPTION_KEYS.includes(key);

	const isNotWritingCreditWithoutNamedEntity = key => item =>
		key !== WRITING_CREDITS || item.writingEntities.some(entity => !!entity.name);

	const isNotCharacterGroupWithoutNamedCharacter = key => item =>
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

			const value = instance[key];

			if (isObjectWithKeys(value)) {

				accumulator[key] = applyModifications(value);

			} else if (Array.isArray(value)) {

				accumulator[key] =
					value
						.filter(hasNameOrIsExempt(key))
						.filter(isNotWritingCreditWithoutNamedEntity(key))
						.filter(isNotCharacterGroupWithoutNamedCharacter(key))
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
