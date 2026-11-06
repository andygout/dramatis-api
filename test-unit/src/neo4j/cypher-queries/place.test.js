import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import * as cypherQueriesVenue from '../../../../src/neo4j/cypher-queries/place/index.js';
import removeExcessWhitespace from '../../../test-helpers/remove-excess-whitespace.js';

describe('Cypher Queries Place module', () => {
	describe('getCreateQuery function', () => {
		it('returns requisite query', () => {
			const result = cypherQueriesVenue.getCreateQuery();

			const compactedResult = removeExcessWhitespace(result);

			const startSegment = removeExcessWhitespace(`
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
			`);

			const middleSegment = removeExcessWhitespace(`
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
			`);

			const endSegment = removeExcessWhitespace(`
				MATCH (place:Place { uuid: $uuid })

				RETURN
					place.uuid AS uuid,
					place.name AS name,
					place.differentiator AS differentiator,
					place.geometryWkt AS geometryWkt
			`);

			assert.equal(compactedResult.startsWith(startSegment), true);
			assert.equal(compactedResult.includes(middleSegment), true);
			assert.equal(compactedResult.endsWith(endSegment), true);
		});
	});

	describe('getUpdateQuery function', () => {
		it('returns requisite query', () => {
			const result = cypherQueriesVenue.getUpdateQuery();

			const compactedResult = removeExcessWhitespace(result);

			const startSegment = removeExcessWhitespace(`
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
			`);

			const middleSegment = removeExcessWhitespace(`
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
			`);

			const endSegment = removeExcessWhitespace(`
				MATCH (place:Place { uuid: $uuid })

				RETURN
					place.uuid AS uuid,
					place.name AS name,
					place.differentiator AS differentiator,
					place.geometryWkt AS geometryWkt
			`);

			assert.equal(compactedResult.startsWith(startSegment), true);
			assert.equal(compactedResult.includes(middleSegment), true);
			assert.equal(compactedResult.endsWith(endSegment), true);
		});
	});
});
