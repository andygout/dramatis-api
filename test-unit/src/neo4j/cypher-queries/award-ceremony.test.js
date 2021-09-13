import { expect } from 'chai';

import * as cypherQueriesAwardCeremonies from '../../../../src/neo4j/cypher-queries/award-ceremony';
import removeExcessWhitespace from '../../../test-helpers/remove-excess-whitespace';

describe('Cypher Queries Award Ceremony module', () => {

	describe('getCreateQuery function', () => {

		it('returns requisite query', () => {

			const result = cypherQueriesAwardCeremonies.getCreateQuery();

			const compactedResult = removeExcessWhitespace(result);

			const startSegment = removeExcessWhitespace(`
				CREATE (awardCeremony:AwardCeremony { uuid: $uuid, name: $name })
			`);

			const middleSegment = removeExcessWhitespace(`
				WITH awardCeremony
			`);

			const endSegment = removeExcessWhitespace(`
				RETURN
					'AWARD_CEREMONY' AS model,
					awardCeremony.uuid AS uuid,
					awardCeremony.name AS name,
					{ name: COALESCE(award.name, ''), differentiator: COALESCE(award.differentiator, '') } AS award,
					COLLECT(
						CASE awardCeremonyCategory WHEN NULL
							THEN null
							ELSE awardCeremonyCategory { .name }
						END
					) + [{}] AS categories
			`);

			expect(compactedResult.startsWith(startSegment)).to.be.true;
			expect(compactedResult.includes(middleSegment)).to.be.true;
			expect(compactedResult.endsWith(endSegment)).to.be.true;

		});

	});

	describe('getUpdateQuery function', () => {

		it('returns requisite query', () => {

			const result = cypherQueriesAwardCeremonies.getUpdateQuery();

			const compactedResult = removeExcessWhitespace(result);

			const startSegment = removeExcessWhitespace(`
				MATCH (awardCeremony:AwardCeremony { uuid: $uuid })

				OPTIONAL MATCH (awardCeremony)-[:PRESENTS_CATEGORY]->(awardCeremonyCategory:AwardCeremonyCategory)

				DETACH DELETE awardCeremonyCategory

				WITH awardCeremony

				OPTIONAL MATCH (awardCeremony)<-[relationship]-()

				DELETE relationship

				WITH DISTINCT awardCeremony

				SET awardCeremony.name = $name
			`);

			const middleSegment = removeExcessWhitespace(`
				WITH awardCeremony
			`);

			const endSegment = removeExcessWhitespace(`
				RETURN
					'AWARD_CEREMONY' AS model,
					awardCeremony.uuid AS uuid,
					awardCeremony.name AS name,
					{ name: COALESCE(award.name, ''), differentiator: COALESCE(award.differentiator, '') } AS award,
					COLLECT(
						CASE awardCeremonyCategory WHEN NULL
							THEN null
							ELSE awardCeremonyCategory { .name }
						END
					) + [{}] AS categories
			`);

			expect(compactedResult.startsWith(startSegment)).to.be.true;
			expect(compactedResult.includes(middleSegment)).to.be.true;
			expect(compactedResult.endsWith(endSegment)).to.be.true;

		});

	});

});
