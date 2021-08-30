import { expect } from 'chai';

import * as cypherQueriesMaterial from '../../../../src/neo4j/cypher-queries/material';
import removeExcessWhitespace from '../../../test-helpers/remove-excess-whitespace';

describe('Cypher Queries Material module', () => {

	describe('getCreateQuery function', () => {

		it('returns requisite query', () => {

			const result = cypherQueriesMaterial.getCreateQuery();

			const compactedResult = removeExcessWhitespace(result);

			const startSegment = removeExcessWhitespace(`
				CREATE (material:Material {
					uuid: $uuid,
					name: $name,
					differentiator: $differentiator,
					format: $format,
					year: $year
				})
			`);

			const middleSegment = removeExcessWhitespace(`
				CREATE (material)-[:SUBSEQUENT_VERSION_OF]->(originalVersionMaterial)
			`);

			const endSegment = removeExcessWhitespace(`
				RETURN
					'MATERIAL' AS model,
					material.uuid AS uuid,
					material.name AS name,
					material.differentiator AS differentiator,
					material.format AS format,
					material.year AS year,
					{
						name: COALESCE(originalVersionMaterial.name, ''),
						differentiator: COALESCE(originalVersionMaterial.differentiator, '')
					} AS originalVersionMaterial,
					writingCredits,
					COLLECT(
						CASE WHEN characterGroupName IS NULL AND SIZE(characters) = 1
							THEN null
							ELSE { model: 'CHARACTER_GROUP', name: characterGroupName, characters: characters }
						END
					) + [{ characters: [{}] }] AS characterGroups
			`);

			expect(compactedResult.startsWith(startSegment)).to.be.true;
			expect(compactedResult.includes(middleSegment)).to.be.true;
			expect(compactedResult.endsWith(endSegment)).to.be.true;

		});

	});

	describe('getUpdateQuery function', () => {

		it('returns requisite query', () => {

			const result = cypherQueriesMaterial.getUpdateQuery();

			const compactedResult = removeExcessWhitespace(result);

			const startSegment = removeExcessWhitespace(`
				MATCH (material:Material { uuid: $uuid })

				OPTIONAL MATCH (material)-[originalVersionMaterialRel:SUBSEQUENT_VERSION_OF]->(:Material)

				DELETE originalVersionMaterialRel

				WITH DISTINCT material

				OPTIONAL MATCH (material)-[writerRel:HAS_WRITING_ENTITY]->(entity)
					WHERE entity:Person OR entity:Company

				DELETE writerRel

				WITH DISTINCT material

				OPTIONAL MATCH (material)-[sourceMaterialCreditRel:USES_SOURCE_MATERIAL]->(:Material)

				DELETE sourceMaterialCreditRel

				WITH DISTINCT material

				OPTIONAL MATCH (material)-[characterRel:HAS_CHARACTER]->(:Character)

				DELETE characterRel

				WITH DISTINCT material

				SET
					material.name = $name,
					material.differentiator = $differentiator,
					material.format = $format,
					material.year = $year
			`);

			const middleSegment = removeExcessWhitespace(`
				CREATE (material)-[:SUBSEQUENT_VERSION_OF]->(originalVersionMaterial)
			`);

			const endSegment = removeExcessWhitespace(`
				RETURN
					'MATERIAL' AS model,
					material.uuid AS uuid,
					material.name AS name,
					material.differentiator AS differentiator,
					material.format AS format,
					material.year AS year,
					{
						name: COALESCE(originalVersionMaterial.name, ''),
						differentiator: COALESCE(originalVersionMaterial.differentiator, '')
					} AS originalVersionMaterial,
					writingCredits,
					COLLECT(
						CASE WHEN characterGroupName IS NULL AND SIZE(characters) = 1
							THEN null
							ELSE { model: 'CHARACTER_GROUP', name: characterGroupName, characters: characters }
						END
					) + [{ characters: [{}] }] AS characterGroups
			`);

			expect(compactedResult.startsWith(startSegment)).to.be.true;
			expect(compactedResult.includes(middleSegment)).to.be.true;
			expect(compactedResult.endsWith(endSegment)).to.be.true;

		});

	});

});
