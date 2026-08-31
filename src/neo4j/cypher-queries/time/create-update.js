import { getEditQuery } from './index.js';
import { ACTIONS } from '../../../utils/constants.js';

const getCreateUpdateQuery = (action) => {
	const createUpdateQueryOpeningMap = {
		[ACTIONS.CREATE]: `
			CREATE (time:Time {
				uuid: $uuid,
				name: $name,
				differentiator: $differentiator,
				fromDate: $fromDate,
				toDate: $toDate
			})
		`,
		[ACTIONS.UPDATE]: `
			MATCH (time:Time { uuid: $uuid })

			SET
				time.name = $name,
				time.differentiator = $differentiator,
				time.fromDate = $fromDate,
				time.toDate = $toDate
		`
	};

	return `
		${createUpdateQueryOpeningMap[action]}

		WITH time

		${getEditQuery()}
	`;
};

const getCreateQuery = () => getCreateUpdateQuery(ACTIONS.CREATE);

const getUpdateQuery = () => getCreateUpdateQuery(ACTIONS.UPDATE);

export { getCreateQuery, getUpdateQuery };
