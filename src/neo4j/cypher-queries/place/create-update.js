import { getEditQuery } from './index.js';
import { ACTIONS } from '../../../utils/constants.js';

const getCreateUpdateQuery = (action) => {
	const createUpdateQueryOpeningMap = {
		[ACTIONS.CREATE]: `
			CREATE (place:Place {
				uuid: $uuid,
				name: $name,
				differentiator: $differentiator
			})
		`,
		[ACTIONS.UPDATE]: `
			MATCH (place:Place { uuid: $uuid })

			OPTIONAL MATCH (:Place)-[surPlaceRel:CONTAINS]->(place)

			DELETE surPlaceRel

			WITH DISTINCT place

			SET
				place.name = $name,
				place.differentiator = $differentiator
		`
	};

	return `
		${createUpdateQueryOpeningMap[action]}

		WITH place

		OPTIONAL MATCH (existingSurPlace:Material { name: $surPlace.name })
			WHERE
				(
					$surPlace.differentiator IS NULL AND
					existingSurPlace.differentiator IS NULL
				) OR (
					$surPlace.differentiator = existingSurPlace.differentiator
				)

		FOREACH (item IN CASE WHEN $surPlace.name IS NULL THEN [] ELSE [1] END |
			MERGE (surPlace:Place {
				uuid: COALESCE(existingSurPlace.uuid, $surPlace.uuid),
				name: $surPlace.name
			})
				ON CREATE SET surPlace.differentiator = $surPlace.differentiator

			CREATE (surPlace)-[:CONTAINS]->(place)
		)

		WITH place

		${getEditQuery()}
	`;
};

const getCreateQuery = () => getCreateUpdateQuery(ACTIONS.CREATE);

const getUpdateQuery = () => getCreateUpdateQuery(ACTIONS.UPDATE);

export { getCreateQuery, getUpdateQuery };
