import { getEditQuery } from './index.js';
import { ACTIONS } from '../../../utils/constants.js';

const getCreateUpdateQuery = (action) => {
	const createUpdateQueryOpeningMap = {
		[ACTIONS.CREATE]: `
			CREATE (place:Place {
				uuid: $uuid,
				name: $name,
				differentiator: $differentiator,
				geometryWkt: $geometryWkt
			})

			WITH place

			CALL (place) {
				WITH place
					WHERE $geometryWkt IS NOT NULL

				CALL spatial.addNode('place-geometries', place) YIELD node

				RETURN node

				UNION

				WITH place
					WHERE $geometryWkt IS NULL

				RETURN null AS node
			}
		`,
		[ACTIONS.UPDATE]: `
			MATCH (place:Place { uuid: $uuid })

			WITH place, place.geometryWkt IS NOT NULL AS hadGeometry

			OPTIONAL MATCH (place)-[subPlaceRel:CONTAINS]->(:Place)

			DELETE subPlaceRel

			WITH DISTINCT place, hadGeometry

			OPTIONAL MATCH (:Place)-[surPlaceRel:CONTAINS]->(place)

			DELETE surPlaceRel

			WITH DISTINCT place, hadGeometry

			SET
				place.name = $name,
				place.differentiator = $differentiator,
				place.geometryWkt = $geometryWkt

			WITH place, hadGeometry

			CALL (place, hadGeometry) {
				WITH place, hadGeometry
					WHERE hadGeometry = false AND $geometryWkt IS NOT NULL

				CALL spatial.addNode('place-geometries', place) YIELD node

				RETURN node

				UNION

				WITH place, hadGeometry
					WHERE hadGeometry = true AND $geometryWkt IS NULL

				CALL spatial.removeNode('place-geometries', place) YIELD nodeId

				RETURN place AS node

				UNION

				WITH place, hadGeometry
					WHERE
						NOT (hadGeometry = false AND $geometryWkt IS NOT NULL) AND
						NOT (hadGeometry = true AND $geometryWkt IS NULL)

				RETURN place AS node
			}
		`
	};

	return `
		${createUpdateQueryOpeningMap[action]}

		WITH place

		CALL (place) {
			WITH place
				WHERE $geometryWkt IS NOT NULL

			CALL spatial.cql(
				'place-geometries',
				'CONTAINS(the_geom, ' + place.geometryWkt + ')'
			) YIELD node
				WHERE node.uuid <> place.uuid

			RETURN collect(node) AS surPlaces

			UNION

			WITH place
				WHERE $geometryWkt IS NULL

			RETURN [] AS surPlaces
		}

		FOREACH (surPlaceToConnect IN surPlaces |
			CREATE (surPlaceToConnect)-[:CONTAINS]->(place)
		)

		WITH DISTINCT place

		CALL (place) {
			WITH place
				WHERE $geometryWkt IS NOT NULL

			CALL spatial.cql(
				'place-geometries',
				'WITHIN(the_geom, ' + place.geometryWkt + ')'
			) YIELD node
				WHERE node.uuid <> place.uuid

			RETURN collect(node) AS subPlaces

			UNION

			WITH place
				WHERE $geometryWkt IS NULL

			RETURN [] AS subPlaces
		}

		FOREACH (subPlaceToConnect IN subPlaces |
			CREATE (place)-[:CONTAINS]->(subPlaceToConnect)
		)

		WITH DISTINCT place

		${getEditQuery()}
	`;
};

const getCreateQuery = () => getCreateUpdateQuery(ACTIONS.CREATE);

const getUpdateQuery = () => getCreateUpdateQuery(ACTIONS.UPDATE);

export { getCreateQuery, getUpdateQuery };
