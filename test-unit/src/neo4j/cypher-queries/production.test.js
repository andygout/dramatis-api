import { expect } from 'chai';

import * as cypherQueriesProduction from '../../../../src/neo4j/cypher-queries/production';
import removeExcessWhitespace from '../../../test-helpers/remove-excess-whitespace';

describe('Cypher Queries Production module', () => {

	describe('getCreateQuery function', () => {

		it('returns requisite query', () => {

			const result = cypherQueriesProduction.getCreateQuery();

			const compactedResult = removeExcessWhitespace(result);

			const startSegment = removeExcessWhitespace(`
				CREATE (production:Production {
					uuid: $uuid,
					name: $name,
					startDate: $startDate,
					pressDate: $pressDate,
					endDate: $endDate
				})
			`);

			const middleSegment = removeExcessWhitespace(`
				CREATE (production)-[:PRODUCTION_OF]->(material)
			`);

			const endSegment = removeExcessWhitespace(`
				RETURN
					production.uuid AS uuid,
					production.name AS name,
					production.startDate AS startDate,
					production.pressDate AS pressDate,
					production.endDate AS endDate,
					{ name: COALESCE(material.name, ''), differentiator: COALESCE(material.differentiator, '') } AS material,
					{ name: COALESCE(venue.name, ''), differentiator: COALESCE(venue.differentiator, '') } AS venue,
					producerCredits,
					cast,
					creativeCredits,
					COLLECT(
						CASE WHEN crewCreditName IS NULL AND SIZE(crewEntities) = 1
							THEN null
							ELSE { name: crewCreditName, entities: crewEntities }
						END
					) + [{ entities: [{}] }] AS crewCredits
			`);

			expect(compactedResult.startsWith(startSegment)).to.be.true;
			expect(compactedResult.includes(middleSegment)).to.be.true;
			expect(compactedResult.endsWith(endSegment)).to.be.true;

		});

	});

	describe('getUpdateQuery function', () => {

		it('returns requisite query', () => {

			const result = cypherQueriesProduction.getUpdateQuery();

			const compactedResult = removeExcessWhitespace(result);

			const startSegment = removeExcessWhitespace(`
				MATCH (production:Production { uuid: $uuid })

				OPTIONAL MATCH (production)-[relationship]-()

				DELETE relationship

				WITH DISTINCT production

				SET
					production.name = $name,
					production.startDate = $startDate,
					production.pressDate = $pressDate,
					production.endDate = $endDate
			`);

			const middleSegment = removeExcessWhitespace(`
				CREATE (production)-[:PLAYS_AT]->(venue)
			`);

			const endSegment = removeExcessWhitespace(`
				RETURN
					production.uuid AS uuid,
					production.name AS name,
					production.startDate AS startDate,
					production.pressDate AS pressDate,
					production.endDate AS endDate,
					{ name: COALESCE(material.name, ''), differentiator: COALESCE(material.differentiator, '') } AS material,
					{ name: COALESCE(venue.name, ''), differentiator: COALESCE(venue.differentiator, '') } AS venue,
					producerCredits,
					cast,
					creativeCredits,
					COLLECT(
						CASE WHEN crewCreditName IS NULL AND SIZE(crewEntities) = 1
							THEN null
							ELSE { name: crewCreditName, entities: crewEntities }
						END
					) + [{ entities: [{}] }] AS crewCredits
			`);

			expect(compactedResult.startsWith(startSegment)).to.be.true;
			expect(compactedResult.includes(middleSegment)).to.be.true;
			expect(compactedResult.endsWith(endSegment)).to.be.true;

		});

	});

});
