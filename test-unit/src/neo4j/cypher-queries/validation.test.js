import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import * as cypherQueriesValidation from '../../../../src/neo4j/cypher-queries/validation/index.js';
import removeExcessWhitespace from '../../../test-helpers/remove-excess-whitespace.js';

describe('Cypher Queries Validation module', () => {
	describe('getDuplicateRecordCheckQuery function', () => {
		it('returns requisite query', () => {
			const result = cypherQueriesValidation.getDuplicateRecordCheckQuery('VENUE', undefined);

			assert.equal(
				removeExcessWhitespace(result),
				removeExcessWhitespace(`
				MATCH (n:Venue { name: $name })
					WHERE
						(
							($differentiator IS NULL AND n.differentiator IS NULL) OR
							$differentiator = n.differentiator
						) AND (
							$uuid IS NULL OR
							$uuid <> n.uuid
						)

				RETURN TOBOOLEAN(COUNT(n)) AS isDuplicateRecord
			`)
			);
		});
	});

	describe('getExistenceCheckQuery function', () => {
		it('returns requisite query', () => {
			const result = cypherQueriesValidation.getExistenceCheckQuery('VENUE');

			assert.equal(
				removeExcessWhitespace(result),
				removeExcessWhitespace(`
				MATCH (n:Venue { uuid: $uuid })

				RETURN TOBOOLEAN(COUNT(n)) AS isExistent
			`)
			);
		});
	});

	describe('getSubMaterialChecksQuery function', () => {
		it('returns requisite query', () => {
			const result = cypherQueriesValidation.getSubMaterialChecksQuery();

			assert.equal(
				removeExcessWhitespace(result),
				removeExcessWhitespace(`
				MATCH (material:Material { name: $name })
					WHERE
						(
							($differentiator IS NULL AND material.differentiator IS NULL) OR
							$differentiator = material.differentiator
						)

				OPTIONAL MATCH (subjectMaterial:Material { uuid: $subjectMaterialUuid })

				OPTIONAL MATCH (material)<-[surMaterialRel:HAS_SUB_MATERIAL]-(surMaterial:Material)
					WHERE
						$subjectMaterialUuid IS NULL OR
						$subjectMaterialUuid <> surMaterial.uuid

				OPTIONAL MATCH (material)
					-[:HAS_SUB_MATERIAL]->(:Material)
					-[subSubMaterialRel:HAS_SUB_MATERIAL]->(:Material)

				OPTIONAL MATCH (material)-[subMaterialRelWithSubjectMaterial:HAS_SUB_MATERIAL]->(subjectMaterial)

				OPTIONAL MATCH (subjectMaterial)
					<-[:HAS_SUB_MATERIAL]-(:Material)
					<-[subjectMaterialSurSurMaterialRel:HAS_SUB_MATERIAL]-(:Material)

				RETURN
					TOBOOLEAN(COUNT(surMaterialRel)) AS isAssignedToSurMaterial,
					TOBOOLEAN(COUNT(subSubMaterialRel)) AS isSurSurMaterial,
					TOBOOLEAN(COUNT(subMaterialRelWithSubjectMaterial)) AS isSurMaterialOfSubjectMaterial,
					TOBOOLEAN(COUNT(subjectMaterialSurSurMaterialRel)) AS isSubjectMaterialASubSubMaterial
			`)
			);
		});
	});

	describe('getSubProductionChecksQuery function', () => {
		it('returns requisite query', () => {
			const result = cypherQueriesValidation.getSubProductionChecksQuery('VENUE');

			assert.equal(
				removeExcessWhitespace(result),
				removeExcessWhitespace(`
				MATCH (production:Production { uuid: $uuid })

				OPTIONAL MATCH (subjectProduction:Production { uuid: $subjectProductionUuid })

				OPTIONAL MATCH (production)<-[surProductionRel:HAS_SUB_PRODUCTION]-(surProduction:Production)
					WHERE
						$subjectProductionUuid IS NULL OR
						$subjectProductionUuid <> surProduction.uuid

				OPTIONAL MATCH (production)
					-[:HAS_SUB_PRODUCTION]->(:Production)
					-[subSubProductionRel:HAS_SUB_PRODUCTION]->(:Production)

				OPTIONAL MATCH (production)-[subProductionRelWithSubjectProduction:HAS_SUB_PRODUCTION]->(subjectProduction)

				OPTIONAL MATCH (subjectProduction)
					<-[:HAS_SUB_PRODUCTION]-(:Production)
					<-[subjectProductionSurSurProductionRel:HAS_SUB_PRODUCTION]-(:Production)

				RETURN
					TOBOOLEAN(COUNT(production)) AS isExistent,
					TOBOOLEAN(COUNT(surProductionRel)) AS isAssignedToSurProduction,
					TOBOOLEAN(COUNT(subSubProductionRel)) AS isSurSurProduction,
					TOBOOLEAN(COUNT(subProductionRelWithSubjectProduction)) AS isSurProductionOfSubjectProduction,
					TOBOOLEAN(COUNT(subjectProductionSurSurProductionRel)) AS isSubjectProductionASubSubProduction
			`)
			);
		});
	});

	describe('getSubVenueChecksQuery function', () => {
		it('returns requisite query', () => {
			const result = cypherQueriesValidation.getSubVenueChecksQuery();

			assert.equal(
				removeExcessWhitespace(result),
				removeExcessWhitespace(`
				MATCH (venue:Venue { name: $name })
					WHERE
						(
							($differentiator IS NULL AND venue.differentiator IS NULL) OR
							$differentiator = venue.differentiator
						)

				OPTIONAL MATCH (subjectVenue:Venue { uuid: $subjectVenueUuid })

				OPTIONAL MATCH (venue)<-[surVenueRel:HAS_SUB_VENUE]-(surVenue:Venue)
					WHERE
						$subjectVenueUuid IS NULL OR
						$subjectVenueUuid <> surVenue.uuid

				OPTIONAL MATCH (venue)-[subVenueRel:HAS_SUB_VENUE]->(:Venue)

				OPTIONAL MATCH (subjectVenue)<-[subjectVenueSurVenueRel:HAS_SUB_VENUE]-(:Venue)

				RETURN
					TOBOOLEAN(COUNT(surVenueRel)) AS isAssignedToSurVenue,
					TOBOOLEAN(COUNT(subVenueRel)) AS isSurVenue,
					TOBOOLEAN(COUNT(subjectVenueSurVenueRel)) AS isSubjectVenueASubVenue
			`)
			);
		});
	});
});
