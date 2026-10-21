import { getEditQuery } from './index.js';
import { ACTIONS } from '../../../utils/constants.js';

const getCreateUpdateQuery = (action) => {
	const createUpdateQueryOpeningMap = {
		[ACTIONS.CREATE]: `
			CREATE (place:Place {
				uuid: $uuid,
				name: $name,
				differentiator: $differentiator,
				minLatitude: $minLatitude,
				maxLatitude: $maxLatitude,
				minLongitude: $minLongitude,
				maxLongitude: $maxLongitude
			})
		`,
		[ACTIONS.UPDATE]: `
			MATCH (place:Place { uuid: $uuid })

			SET
				place.name = $name,
				place.differentiator = $differentiator,
				place.minLatitude = $minLatitude,
				place.maxLatitude = $maxLatitude,
				place.minLongitude = $minLongitude,
				place.maxLongitude = $maxLongitude
		`
	};

	return `
		${createUpdateQueryOpeningMap[action]}

		WITH place

		${getEditQuery()}
	`;
};

const getCreateQuery = () => getCreateUpdateQuery(ACTIONS.CREATE);

const getUpdateQuery = () => getCreateUpdateQuery(ACTIONS.UPDATE);

export { getCreateQuery, getUpdateQuery };
