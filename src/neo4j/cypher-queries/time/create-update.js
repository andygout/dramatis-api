import { getEditQuery } from './index.js';
import { ACTIONS } from '../../../utils/constants.js';

const getCreateUpdateQuery = (action) => {
	const createUpdateQueryOpeningMap = {
		[ACTIONS.CREATE]: `
			CREATE (time:Time {
				uuid: $uuid,
				name: $name,
				differentiator: $differentiator,
				fromDate: date($fromDate),
				toDate: date($toDate)
			})
		`,
		[ACTIONS.UPDATE]: `
			MATCH (time:Time { uuid: $uuid })

			OPTIONAL MATCH (time)-[subTimeRel:CONTAINS]->(:Time)

			DELETE subTimeRel

			WITH DISTINCT time

			OPTIONAL MATCH (:Time)-[surTimeRel:CONTAINS]->(time)

			DELETE surTimeRel

			WITH DISTINCT time

			SET
				time.name = $name,
				time.differentiator = $differentiator,
				time.fromDate = date($fromDate),
				time.toDate = date($toDate)
		`
	};

	return `
		${createUpdateQueryOpeningMap[action]}

		WITH time

		OPTIONAL MATCH (surTime:Time)
			WHERE surTime <> time AND
				(
					surTime.fromDate <= time.fromDate AND
					surTime.toDate >= time.toDate
				)

		FOREACH (surTimeToConnect IN CASE WHEN surTime IS NULL THEN [] ELSE [surTime] END |
			CREATE (surTimeToConnect)-[:CONTAINS]->(time)
		)

		WITH DISTINCT time

		OPTIONAL MATCH (subTime:Time)
			WHERE subTime <> time AND
				(
					subTime.fromDate >= time.fromDate AND
					subTime.toDate <= time.toDate
				)

		FOREACH (subTimeToConnect IN CASE WHEN subTime IS NULL THEN [] ELSE [subTime] END |
			CREATE (time)-[:CONTAINS]->(subTimeToConnect)
		)

		WITH DISTINCT time

		${getEditQuery()}
	`;
};

const getCreateQuery = () => getCreateUpdateQuery(ACTIONS.CREATE);

const getUpdateQuery = () => getCreateUpdateQuery(ACTIONS.UPDATE);

export { getCreateQuery, getUpdateQuery };
