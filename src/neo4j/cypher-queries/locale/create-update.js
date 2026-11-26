import { getEditQuery } from './index.js';
import { ACTIONS } from '../../../utils/constants.js';

const getCreateUpdateQuery = (action) => {
	const createUpdateQueryOpeningMap = {
		[ACTIONS.CREATE]: `
			CREATE (locale:Locale {
				uuid: $uuid,
				name: $name,
				differentiator: $differentiator
			})
		`,
		[ACTIONS.UPDATE]: `
			MATCH (locale:Locale { uuid: $uuid })

			OPTIONAL MATCH (:Locale)-[surLocaleRel:CONTAINS]->(locale)

			DELETE surLocaleRel

			WITH DISTINCT locale

			SET
				locale.name = $name,
				locale.differentiator = $differentiator
		`
	};

	return `
		${createUpdateQueryOpeningMap[action]}

		WITH locale

		OPTIONAL MATCH (existingSurLocale:Locale { name: $surLocale.name })
			WHERE
				(
					$surLocale.differentiator IS NULL AND
					existingSurLocale.differentiator IS NULL
				) OR (
					$surLocale.differentiator = existingSurLocale.differentiator
				)

		FOREACH (item IN CASE WHEN $surLocale.name IS NULL THEN [] ELSE [1] END |
			MERGE (surLocale:Locale {
				uuid: COALESCE(existingSurLocale.uuid, $surLocale.uuid),
				name: $surLocale.name
			})
				ON CREATE SET surLocale.differentiator = $surLocale.differentiator

			CREATE (surLocale)-[:CONTAINS]->(locale)
		)

		WITH locale

		${getEditQuery()}
	`;
};

const getCreateQuery = () => getCreateUpdateQuery(ACTIONS.CREATE);

const getUpdateQuery = () => getCreateUpdateQuery(ACTIONS.UPDATE);

export { getCreateQuery, getUpdateQuery };
