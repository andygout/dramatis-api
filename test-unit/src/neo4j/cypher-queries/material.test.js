import { expect } from 'chai';

import * as cypherQueriesMaterial from '../../../../src/neo4j/cypher-queries/material';
import removeExcessWhitespace from '../../../test-helpers/remove-excess-whitespace';

describe('Cypher Queries Material module', () => {

	describe('getCreateQuery function', () => {

		it('returns requisite query', () => {

			const result = cypherQueriesMaterial.getCreateQuery();
			expect(removeExcessWhitespace(result)).to.equal(removeExcessWhitespace(`
				CREATE (material:Material { uuid: $uuid, name: $name, differentiator: $differentiator, format: $format })

				WITH material

				OPTIONAL MATCH (existingOriginalVersionMaterial:Material { name: $originalVersionMaterial.name })
					WHERE
						(
							$originalVersionMaterial.differentiator IS NULL AND
							existingOriginalVersionMaterial.differentiator IS NULL
						) OR
						$originalVersionMaterial.differentiator = existingOriginalVersionMaterial.differentiator

				FOREACH (item IN CASE $originalVersionMaterial.name WHEN NULL THEN [] ELSE [1] END |
					MERGE (originalVersionMaterial:Material {
						uuid: COALESCE(existingOriginalVersionMaterial.uuid, $originalVersionMaterial.uuid),
						name: $originalVersionMaterial.name
					})
						ON CREATE SET originalVersionMaterial.differentiator = $originalVersionMaterial.differentiator

					CREATE (material)-[:SUBSEQUENT_VERSION_OF]->(originalVersionMaterial)
				)

				WITH material

				UNWIND (CASE $writingCredits WHEN [] THEN [{ writingEntities: [] }] ELSE $writingCredits END) AS writingCredit

					UNWIND
						CASE SIZE([entity IN writingCredit.writingEntities WHERE entity.model = 'person']) WHEN 0
							THEN [null]
							ELSE [entity IN writingCredit.writingEntities WHERE entity.model = 'person']
						END AS writingPersonParam

						OPTIONAL MATCH (existingWritingPerson:Person { name: writingPersonParam.name })
							WHERE
								(writingPersonParam.differentiator IS NULL AND existingWritingPerson.differentiator IS NULL) OR
								writingPersonParam.differentiator = existingWritingPerson.differentiator

						FOREACH (item IN CASE writingPersonParam WHEN NULL THEN [] ELSE [1] END |
							MERGE (writingPerson:Person {
								uuid: COALESCE(existingWritingPerson.uuid, writingPersonParam.uuid),
								name: writingPersonParam.name
							})
								ON CREATE SET writingPerson.differentiator = writingPersonParam.differentiator

							CREATE (material)-
								[:WRITTEN_BY {
									creditPosition: writingCredit.position,
									entityPosition: writingPersonParam.position,
									credit: writingCredit.name,
									creditType: writingCredit.creditType
								}]->(writingPerson)
						)

					WITH DISTINCT material, writingCredit

					UNWIND
						CASE SIZE([entity IN writingCredit.writingEntities WHERE entity.model = 'company']) WHEN 0
							THEN [null]
							ELSE [entity IN writingCredit.writingEntities WHERE entity.model = 'company']
						END AS writingCompanyParam

						OPTIONAL MATCH (existingWritingCompany:Company { name: writingCompanyParam.name })
							WHERE
								(
									writingCompanyParam.differentiator IS NULL AND
									existingWritingCompany.differentiator IS NULL
								) OR
								writingCompanyParam.differentiator = existingWritingCompany.differentiator

						FOREACH (item IN CASE writingCompanyParam WHEN NULL THEN [] ELSE [1] END |
							MERGE (writingCompany:Company {
								uuid: COALESCE(existingWritingCompany.uuid, writingCompanyParam.uuid),
								name: writingCompanyParam.name
							})
								ON CREATE SET writingCompany.differentiator = writingCompanyParam.differentiator

							CREATE (material)-
								[:WRITTEN_BY {
									creditPosition: writingCredit.position,
									entityPosition: writingCompanyParam.position,
									credit: writingCredit.name,
									creditType: writingCredit.creditType
								}]->(writingCompany)
						)

					WITH DISTINCT material, writingCredit

					UNWIND
						CASE SIZE([entity IN writingCredit.writingEntities WHERE entity.model = 'material']) WHEN 0
							THEN [null]
							ELSE [entity IN writingCredit.writingEntities WHERE entity.model = 'material']
						END AS sourceMaterialParam

						OPTIONAL MATCH (existingSourceMaterial:Material { name: sourceMaterialParam.name })
							WHERE
								(
									sourceMaterialParam.differentiator IS NULL AND
									existingSourceMaterial.differentiator IS NULL
								) OR
								sourceMaterialParam.differentiator = existingSourceMaterial.differentiator

						FOREACH (item IN CASE sourceMaterialParam WHEN NULL THEN [] ELSE [1] END |
							MERGE (sourceMaterial:Material {
								uuid: COALESCE(existingSourceMaterial.uuid, sourceMaterialParam.uuid),
								name: sourceMaterialParam.name
							})
								ON CREATE SET sourceMaterial.differentiator = sourceMaterialParam.differentiator

							CREATE (material)-
								[:USES_SOURCE_MATERIAL {
									creditPosition: writingCredit.position,
									entityPosition: sourceMaterialParam.position,
									credit: writingCredit.name
								}]->(sourceMaterial)
						)

				WITH DISTINCT material

				UNWIND (CASE $characterGroups WHEN [] THEN [{ characters: [] }] ELSE $characterGroups END) AS characterGroup

					UNWIND (CASE characterGroup.characters WHEN []
						THEN [null]
						ELSE characterGroup.characters
					END) AS characterParam

						OPTIONAL MATCH (existingCharacter:Character {
							name: COALESCE(characterParam.underlyingName, characterParam.name)
						})
							WHERE
								(characterParam.differentiator IS NULL AND existingCharacter.differentiator IS NULL) OR
								characterParam.differentiator = existingCharacter.differentiator

						FOREACH (item IN CASE characterParam WHEN NULL THEN [] ELSE [1] END |
							MERGE (character:Character {
								uuid: COALESCE(existingCharacter.uuid, characterParam.uuid),
								name: COALESCE(characterParam.underlyingName, characterParam.name)
							})
								ON CREATE SET character.differentiator = characterParam.differentiator

							CREATE (material)-
								[:INCLUDES_CHARACTER {
									groupPosition: characterGroup.position,
									characterPosition: characterParam.position,
									displayName: CASE characterParam.underlyingName WHEN NULL
										THEN null
										ELSE characterParam.name
									END,
									qualifier: characterParam.qualifier,
									group: characterGroup.name
								}]->(character)
						)

				WITH DISTINCT material

				MATCH (material:Material { uuid: $uuid })

				OPTIONAL MATCH (material)-[:SUBSEQUENT_VERSION_OF]->(originalVersionMaterial:Material)

				OPTIONAL MATCH (material)-[writingEntityRel:WRITTEN_BY|USES_SOURCE_MATERIAL]->(writingEntity)
					WHERE writingEntity:Person OR writingEntity:Company OR writingEntity:Material

				WITH material, originalVersionMaterial, writingEntityRel, writingEntity
					ORDER BY writingEntityRel.creditPosition, writingEntityRel.entityPosition

				WITH
					material,
					originalVersionMaterial,
					writingEntityRel.credit AS writingCreditName,
					writingEntityRel.creditType AS writingCreditType,
					COLLECT(
						CASE writingEntity WHEN NULL
							THEN null
							ELSE writingEntity { model: TOLOWER(HEAD(LABELS(writingEntity))), .name, .differentiator }
						END
					) + [{}] AS writingEntities

				WITH material, originalVersionMaterial,
					COLLECT(
						CASE WHEN writingCreditName IS NULL AND SIZE(writingEntities) = 1
							THEN null
							ELSE {
								model: 'writingCredit',
								name: writingCreditName,
								creditType: writingCreditType,
								writingEntities: writingEntities
							}
						END
					) + [{ writingEntities: [{}] }] AS writingCredits

				OPTIONAL MATCH (material)-[characterRel:INCLUDES_CHARACTER]->(character:Character)

				WITH material, originalVersionMaterial, writingCredits, characterRel, character
					ORDER BY characterRel.groupPosition, characterRel.characterPosition

				WITH material, originalVersionMaterial, writingCredits, characterRel.group AS characterGroupName,
					COLLECT(
						CASE character WHEN NULL
							THEN null
							ELSE character {
								name: COALESCE(characterRel.displayName, character.name),
								underlyingName: CASE characterRel.displayName WHEN NULL THEN null ELSE character.name END,
								.differentiator,
								qualifier: characterRel.qualifier,
								group: characterRel.group
							}
						END
					) + [{}] AS characters

				RETURN
					'material' AS model,
					material.uuid AS uuid,
					material.name AS name,
					material.differentiator AS differentiator,
					material.format AS format,
					{
						name: CASE originalVersionMaterial.name WHEN NULL THEN '' ELSE originalVersionMaterial.name END,
						differentiator: CASE originalVersionMaterial.differentiator WHEN NULL
							THEN ''
							ELSE originalVersionMaterial.differentiator
						END
					} AS originalVersionMaterial,
					writingCredits,
					COLLECT(
						CASE WHEN characterGroupName IS NULL AND SIZE(characters) = 1
							THEN null
							ELSE { model: 'characterGroup', name: characterGroupName, characters: characters }
						END
					) + [{ characters: [{}] }] AS characterGroups
			`));

		});

	});

	describe('getUpdateQuery function', () => {

		it('returns requisite query', () => {

			const result = cypherQueriesMaterial.getUpdateQuery();
			expect(removeExcessWhitespace(result)).to.equal(removeExcessWhitespace(`
				MATCH (material:Material { uuid: $uuid })

				OPTIONAL MATCH (material)-[originalVersionMaterialRel:SUBSEQUENT_VERSION_OF]->(:Material)

				DELETE originalVersionMaterialRel

				WITH DISTINCT material

				OPTIONAL MATCH (material)-[writerRel:WRITTEN_BY]->(writingEntity)
					WHERE writingEntity:Person OR writingEntity:Company

				DELETE writerRel

				WITH DISTINCT material

				OPTIONAL MATCH (material)-[sourceMaterialCreditRel:USES_SOURCE_MATERIAL]->(:Material)

				DELETE sourceMaterialCreditRel

				WITH DISTINCT material

				OPTIONAL MATCH (material)-[characterRel:INCLUDES_CHARACTER]->(:Character)

				DELETE characterRel

				WITH DISTINCT material

				SET
					material.name = $name,
					material.differentiator = $differentiator,
					material.format = $format

				WITH material

				OPTIONAL MATCH (existingOriginalVersionMaterial:Material { name: $originalVersionMaterial.name })
					WHERE
						(
							$originalVersionMaterial.differentiator IS NULL AND
							existingOriginalVersionMaterial.differentiator IS NULL
						) OR
						$originalVersionMaterial.differentiator = existingOriginalVersionMaterial.differentiator

				FOREACH (item IN CASE $originalVersionMaterial.name WHEN NULL THEN [] ELSE [1] END |
					MERGE (originalVersionMaterial:Material {
						uuid: COALESCE(existingOriginalVersionMaterial.uuid, $originalVersionMaterial.uuid),
						name: $originalVersionMaterial.name
					})
						ON CREATE SET originalVersionMaterial.differentiator = $originalVersionMaterial.differentiator

					CREATE (material)-[:SUBSEQUENT_VERSION_OF]->(originalVersionMaterial)
				)

				WITH material

				UNWIND (CASE $writingCredits WHEN [] THEN [{ writingEntities: [] }] ELSE $writingCredits END) AS writingCredit

					UNWIND
						CASE SIZE([entity IN writingCredit.writingEntities WHERE entity.model = 'person']) WHEN 0
							THEN [null]
							ELSE [entity IN writingCredit.writingEntities WHERE entity.model = 'person']
						END AS writingPersonParam

						OPTIONAL MATCH (existingWritingPerson:Person { name: writingPersonParam.name })
							WHERE
								(writingPersonParam.differentiator IS NULL AND existingWritingPerson.differentiator IS NULL) OR
								writingPersonParam.differentiator = existingWritingPerson.differentiator

						FOREACH (item IN CASE writingPersonParam WHEN NULL THEN [] ELSE [1] END |
							MERGE (writingPerson:Person {
								uuid: COALESCE(existingWritingPerson.uuid, writingPersonParam.uuid),
								name: writingPersonParam.name
							})
								ON CREATE SET writingPerson.differentiator = writingPersonParam.differentiator

							CREATE (material)-
								[:WRITTEN_BY {
									creditPosition: writingCredit.position,
									entityPosition: writingPersonParam.position,
									credit: writingCredit.name,
									creditType: writingCredit.creditType
								}]->(writingPerson)
						)

					WITH DISTINCT material, writingCredit

					UNWIND
						CASE SIZE([entity IN writingCredit.writingEntities WHERE entity.model = 'company']) WHEN 0
							THEN [null]
							ELSE [entity IN writingCredit.writingEntities WHERE entity.model = 'company']
						END AS writingCompanyParam

						OPTIONAL MATCH (existingWritingCompany:Company { name: writingCompanyParam.name })
							WHERE
								(
									writingCompanyParam.differentiator IS NULL AND
									existingWritingCompany.differentiator IS NULL
								) OR
								writingCompanyParam.differentiator = existingWritingCompany.differentiator

						FOREACH (item IN CASE writingCompanyParam WHEN NULL THEN [] ELSE [1] END |
							MERGE (writingCompany:Company {
								uuid: COALESCE(existingWritingCompany.uuid, writingCompanyParam.uuid),
								name: writingCompanyParam.name
							})
								ON CREATE SET writingCompany.differentiator = writingCompanyParam.differentiator

							CREATE (material)-
								[:WRITTEN_BY {
									creditPosition: writingCredit.position,
									entityPosition: writingCompanyParam.position,
									credit: writingCredit.name,
									creditType: writingCredit.creditType
								}]->(writingCompany)
						)

					WITH DISTINCT material, writingCredit

					UNWIND
						CASE SIZE([entity IN writingCredit.writingEntities WHERE entity.model = 'material']) WHEN 0
							THEN [null]
							ELSE [entity IN writingCredit.writingEntities WHERE entity.model = 'material']
						END AS sourceMaterialParam

						OPTIONAL MATCH (existingSourceMaterial:Material { name: sourceMaterialParam.name })
							WHERE
								(
									sourceMaterialParam.differentiator IS NULL AND
									existingSourceMaterial.differentiator IS NULL
								) OR
								sourceMaterialParam.differentiator = existingSourceMaterial.differentiator

						FOREACH (item IN CASE sourceMaterialParam WHEN NULL THEN [] ELSE [1] END |
							MERGE (sourceMaterial:Material {
								uuid: COALESCE(existingSourceMaterial.uuid, sourceMaterialParam.uuid),
								name: sourceMaterialParam.name
							})
								ON CREATE SET sourceMaterial.differentiator = sourceMaterialParam.differentiator

							CREATE (material)-
								[:USES_SOURCE_MATERIAL {
									creditPosition: writingCredit.position,
									entityPosition: sourceMaterialParam.position,
									credit: writingCredit.name
								}]->(sourceMaterial)
						)

				WITH DISTINCT material

				UNWIND (CASE $characterGroups WHEN [] THEN [{ characters: [] }] ELSE $characterGroups END) AS characterGroup

					UNWIND (CASE characterGroup.characters WHEN []
						THEN [null]
						ELSE characterGroup.characters
					END) AS characterParam

						OPTIONAL MATCH (existingCharacter:Character {
							name: COALESCE(characterParam.underlyingName, characterParam.name)
						})
							WHERE
								(characterParam.differentiator IS NULL AND existingCharacter.differentiator IS NULL) OR
								characterParam.differentiator = existingCharacter.differentiator

						FOREACH (item IN CASE characterParam WHEN NULL THEN [] ELSE [1] END |
							MERGE (character:Character {
								uuid: COALESCE(existingCharacter.uuid, characterParam.uuid),
								name: COALESCE(characterParam.underlyingName, characterParam.name)
							})
								ON CREATE SET character.differentiator = characterParam.differentiator

							CREATE (material)-
								[:INCLUDES_CHARACTER {
									groupPosition: characterGroup.position,
									characterPosition: characterParam.position,
									displayName: CASE characterParam.underlyingName WHEN NULL
										THEN null
										ELSE characterParam.name
									END,
									qualifier: characterParam.qualifier,
									group: characterGroup.name
								}]->(character)
						)

				WITH DISTINCT material

				MATCH (material:Material { uuid: $uuid })

				OPTIONAL MATCH (material)-[:SUBSEQUENT_VERSION_OF]->(originalVersionMaterial:Material)

				OPTIONAL MATCH (material)-[writingEntityRel:WRITTEN_BY|USES_SOURCE_MATERIAL]->(writingEntity)
					WHERE writingEntity:Person OR writingEntity:Company OR writingEntity:Material

				WITH material, originalVersionMaterial, writingEntityRel, writingEntity
					ORDER BY writingEntityRel.creditPosition, writingEntityRel.entityPosition

				WITH
					material,
					originalVersionMaterial,
					writingEntityRel.credit AS writingCreditName,
					writingEntityRel.creditType AS writingCreditType,
					COLLECT(
						CASE writingEntity WHEN NULL
							THEN null
							ELSE writingEntity { model: TOLOWER(HEAD(LABELS(writingEntity))), .name, .differentiator }
						END
					) + [{}] AS writingEntities

				WITH material, originalVersionMaterial,
					COLLECT(
						CASE WHEN writingCreditName IS NULL AND SIZE(writingEntities) = 1
							THEN null
							ELSE {
								model: 'writingCredit',
								name: writingCreditName,
								creditType: writingCreditType,
								writingEntities: writingEntities
							}
						END
					) + [{ writingEntities: [{}] }] AS writingCredits

				OPTIONAL MATCH (material)-[characterRel:INCLUDES_CHARACTER]->(character:Character)

				WITH material, originalVersionMaterial, writingCredits, characterRel, character
					ORDER BY characterRel.groupPosition, characterRel.characterPosition

				WITH material, originalVersionMaterial, writingCredits, characterRel.group AS characterGroupName,
					COLLECT(
						CASE character WHEN NULL
							THEN null
							ELSE character {
								name: COALESCE(characterRel.displayName, character.name),
								underlyingName: CASE characterRel.displayName WHEN NULL THEN null ELSE character.name END,
								.differentiator,
								qualifier: characterRel.qualifier,
								group: characterRel.group
							}
						END
					) + [{}] AS characters

				RETURN
					'material' AS model,
					material.uuid AS uuid,
					material.name AS name,
					material.differentiator AS differentiator,
					material.format AS format,
					{
						name: CASE originalVersionMaterial.name WHEN NULL THEN '' ELSE originalVersionMaterial.name END,
						differentiator: CASE originalVersionMaterial.differentiator WHEN NULL
							THEN ''
							ELSE originalVersionMaterial.differentiator
						END
					} AS originalVersionMaterial,
					writingCredits,
					COLLECT(
						CASE WHEN characterGroupName IS NULL AND SIZE(characters) = 1
							THEN null
							ELSE { model: 'characterGroup', name: characterGroupName, characters: characters }
						END
					) + [{ characters: [{}] }] AS characterGroups
			`));

		});

	});

});
