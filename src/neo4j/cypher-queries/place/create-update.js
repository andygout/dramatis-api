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

			OPTIONAL MATCH (place)-[subPlaceRel:CONTAINS]->(:Place)

			DELETE subPlaceRel

			WITH DISTINCT place

			OPTIONAL MATCH (:Place)-[surPlaceRel:CONTAINS]->(place)

			DELETE surPlaceRel

			WITH DISTINCT place

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

		OPTIONAL MATCH (surPlace:Place)
			WHERE surPlace <> place AND
				(
					surPlace.minLatitude <= place.minLatitude AND
					surPlace.maxLatitude >= place.maxLatitude AND (
						(
							// 1. Antarctica contains McMurdo Station (about 78°S); its longitude is unrestricted.
							surPlace.minLongitude = -180 AND surPlace.maxLongitude = 180
						) OR (
							// 2. France contains Paris; neither longitude interval crosses the antimeridian.
							surPlace.minLongitude <= surPlace.maxLongitude AND
							place.minLongitude <= place.maxLongitude AND
							place.minLongitude >= surPlace.minLongitude AND
							place.maxLongitude <= surPlace.maxLongitude
						) OR (
							// 3. The containing place crosses the antimeridian, e.g. Russia.
							surPlace.minLongitude > surPlace.maxLongitude AND (
								(
									// 3.a. Russia contains Wrangel Island; both longitude intervals cross the antimeridian.
									place.minLongitude > place.maxLongitude AND
									place.minLongitude >= surPlace.minLongitude AND
									place.maxLongitude <= surPlace.maxLongitude
								) OR (
									place.minLongitude <= place.maxLongitude AND (
										// 3.b. Russia contains Moscow in its eastern longitude segment.
										place.minLongitude >= surPlace.minLongitude OR
										// 3.c. Russia contains Herald Island in its western longitude segment.
										place.maxLongitude <= surPlace.maxLongitude
									)
								)
							)
						)
					)
				)

		FOREACH (surPlaceToConnect IN CASE WHEN surPlace IS NULL THEN [] ELSE [surPlace] END |
			CREATE (surPlaceToConnect)-[:CONTAINS]->(place)
		)

		WITH DISTINCT place

		OPTIONAL MATCH (subPlace:Place)
			WHERE subPlace <> place AND
				(
					subPlace.minLatitude >= place.minLatitude AND
					subPlace.maxLatitude <= place.maxLatitude AND (
						(
							// 1. Antarctica contains McMurdo Station (about 78°S); its longitude is unrestricted.
							place.minLongitude = -180 AND place.maxLongitude = 180
						) OR (
							// 2. France contains Paris; neither longitude interval crosses the antimeridian.
							place.minLongitude <= place.maxLongitude AND
							subPlace.minLongitude <= subPlace.maxLongitude AND
							subPlace.minLongitude >= place.minLongitude AND
							subPlace.maxLongitude <= place.maxLongitude
						) OR (
							// 3. The containing place crosses the antimeridian, e.g. Russia.
							place.minLongitude > place.maxLongitude AND (
								(
									// 3.a. Russia contains Wrangel Island; both longitude intervals cross the antimeridian.
									subPlace.minLongitude > subPlace.maxLongitude AND
									subPlace.minLongitude >= place.minLongitude AND
									subPlace.maxLongitude <= place.maxLongitude
								) OR (
									subPlace.minLongitude <= subPlace.maxLongitude AND (
										// 3.b. Russia contains Moscow in its eastern longitude segment.
										subPlace.minLongitude >= place.minLongitude OR
										// 3.c. Russia contains Herald Island in its western longitude segment.
										subPlace.maxLongitude <= place.maxLongitude
									)
								)
							)
						)
					)
				)

		FOREACH (subPlaceToConnect IN CASE WHEN subPlace IS NULL THEN [] ELSE [subPlace] END |
			CREATE (place)-[:CONTAINS]->(subPlaceToConnect)
		)

		WITH DISTINCT place

		${getEditQuery()}
	`;
};

const getCreateQuery = () => getCreateUpdateQuery(ACTIONS.CREATE);

const getUpdateQuery = () => getCreateUpdateQuery(ACTIONS.UPDATE);

export { getCreateQuery, getUpdateQuery };
