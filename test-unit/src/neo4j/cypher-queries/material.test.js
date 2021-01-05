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
						($originalVersionMaterial.differentiator IS NULL AND existingOriginalVersionMaterial.differentiator IS NULL) OR
						($originalVersionMaterial.differentiator = existingOriginalVersionMaterial.differentiator)

				WITH
					material,
					CASE existingOriginalVersionMaterial WHEN NULL
						THEN {
							uuid: $originalVersionMaterial.uuid,
							name: $originalVersionMaterial.name,
							differentiator: $originalVersionMaterial.differentiator
						}
						ELSE existingOriginalVersionMaterial
					END AS originalVersionMaterialProps

				FOREACH (item IN CASE $originalVersionMaterial.name WHEN NULL THEN [] ELSE [1] END |
					MERGE (originalVersionMaterial:Material {
						uuid: originalVersionMaterialProps.uuid,
						name: originalVersionMaterialProps.name
					})
						ON CREATE SET originalVersionMaterial.differentiator = originalVersionMaterialProps.differentiator

					CREATE (material)-[:SUBSEQUENT_VERSION_OF]->(originalVersionMaterial)
				)

				WITH material

				UNWIND (CASE $writerGroups WHEN [] THEN [{ writers: [] }] ELSE $writerGroups END) AS writerGroupParam

					UNWIND
						CASE SIZE([writer IN writerGroupParam.writers WHERE writer.model = 'person']) WHEN 0
							THEN [null]
							ELSE [writer IN writerGroupParam.writers WHERE writer.model = 'person']
						END AS writerParam

						OPTIONAL MATCH (existingWriter:Person { name: writerParam.name })
							WHERE
								(writerParam.differentiator IS NULL AND existingWriter.differentiator IS NULL) OR
								(writerParam.differentiator = existingWriter.differentiator)

						WITH
							material,
							writerGroupParam,
							writerParam,
							CASE existingWriter WHEN NULL
								THEN {
									uuid: writerParam.uuid,
									name: writerParam.name,
									differentiator: writerParam.differentiator
								}
								ELSE existingWriter
							END AS writerProps

						FOREACH (item IN CASE WHEN writerParam IS NOT NULL AND writerParam.model = 'person' THEN [1] ELSE [] END |
							MERGE (writer:Person { uuid: writerProps.uuid, name: writerProps.name })
								ON CREATE SET writer.differentiator = writerProps.differentiator

							CREATE (material)-
								[:WRITTEN_BY {
									groupPosition: writerGroupParam.position,
									writerPosition: writerParam.position,
									group: writerGroupParam.name,
									isOriginalVersionWriter: writerGroupParam.isOriginalVersionWriter
								}]->(writer)
						)

					WITH DISTINCT material, writerGroupParam

					UNWIND
						CASE SIZE([writer IN writerGroupParam.writers WHERE writer.model = 'material']) WHEN 0
							THEN [null]
							ELSE [writer IN writerGroupParam.writers WHERE writer.model = 'material']
						END AS sourceMaterialParam

						OPTIONAL MATCH (existingSourceMaterial:Material { name: sourceMaterialParam.name })
							WHERE
								(sourceMaterialParam.differentiator IS NULL AND existingSourceMaterial.differentiator IS NULL) OR
								(sourceMaterialParam.differentiator = existingSourceMaterial.differentiator)

						WITH
							material,
							writerGroupParam,
							sourceMaterialParam,
							CASE existingSourceMaterial WHEN NULL
								THEN {
									uuid: sourceMaterialParam.uuid,
									name: sourceMaterialParam.name,
									differentiator: sourceMaterialParam.differentiator
								}
								ELSE existingSourceMaterial
							END AS sourceMaterialProps

						FOREACH (item IN CASE WHEN sourceMaterialParam IS NOT NULL AND sourceMaterialParam.model = 'material' THEN [1] ELSE [] END |
							MERGE (sourceMaterial:Material { uuid: sourceMaterialProps.uuid, name: sourceMaterialProps.name })
								ON CREATE SET sourceMaterial.differentiator = sourceMaterialProps.differentiator

							CREATE (material)-
								[:USES_SOURCE_MATERIAL {
									groupPosition: writerGroupParam.position,
									writerPosition: sourceMaterialParam.position,
									group: writerGroupParam.name
								}]->(sourceMaterial)
						)

				WITH DISTINCT material

				UNWIND (CASE $characterGroups WHEN [] THEN [{ characters: [] }] ELSE $characterGroups END) AS characterGroupParam

					UNWIND (CASE characterGroupParam.characters WHEN [] THEN [null] ELSE characterGroupParam.characters END) AS characterParam

						OPTIONAL MATCH (existingCharacter:Character {
							name: COALESCE(characterParam.underlyingName, characterParam.name)
						})
							WHERE
								(characterParam.differentiator IS NULL AND existingCharacter.differentiator IS NULL) OR
								(characterParam.differentiator = existingCharacter.differentiator)

						WITH
							material,
							characterGroupParam,
							characterParam,
							CASE existingCharacter WHEN NULL
								THEN {
									uuid: characterParam.uuid,
									name: COALESCE(characterParam.underlyingName, characterParam.name),
									differentiator: characterParam.differentiator
								}
								ELSE existingCharacter
							END AS characterProps

						FOREACH (item IN CASE characterParam WHEN NULL THEN [] ELSE [1] END |
							MERGE (character:Character { uuid: characterProps.uuid, name: characterProps.name })
								ON CREATE SET character.differentiator = characterProps.differentiator

							CREATE (material)-
								[:INCLUDES_CHARACTER {
									groupPosition: characterGroupParam.position,
									characterPosition: characterParam.position,
									displayName: CASE characterParam.underlyingName WHEN NULL THEN null ELSE characterParam.name END,
									qualifier: characterParam.qualifier,
									group: characterGroupParam.name
								}]->(character)
						)

				WITH DISTINCT material

				MATCH (material:Material { uuid: $uuid })

				OPTIONAL MATCH (material)-[:SUBSEQUENT_VERSION_OF]->(originalVersionMaterial:Material)

				OPTIONAL MATCH (material)-[writerRel:WRITTEN_BY|USES_SOURCE_MATERIAL]->(writer)
					WHERE writer:Person OR writer:Material

				WITH material, originalVersionMaterial, writerRel, writer
					ORDER BY writerRel.groupPosition, writerRel.writerPosition

				WITH
					material,
					originalVersionMaterial,
					writerRel.group AS writerGroupName,
					writerRel.isOriginalVersionWriter AS isOriginalVersionWriter,
					COLLECT(
						CASE writer WHEN NULL
							THEN null
							ELSE { model: TOLOWER(HEAD(LABELS(writer))), name: writer.name, differentiator: writer.differentiator }
						END
					) + [{}] AS writers

				WITH material, originalVersionMaterial,
					COLLECT(
						CASE WHEN writerGroupName IS NULL AND SIZE(writers) = 1
							THEN null
							ELSE {
								model: 'writerGroup',
								name: writerGroupName,
								isOriginalVersionWriter: isOriginalVersionWriter,
								writers: writers
							}
						END
					) + [{ writers: [{}] }] AS writerGroups

				OPTIONAL MATCH (material)-[characterRel:INCLUDES_CHARACTER]->(character:Character)

				WITH material, originalVersionMaterial, writerGroups, characterRel, character
					ORDER BY characterRel.groupPosition, characterRel.characterPosition

				WITH material, originalVersionMaterial, writerGroups, characterRel.group AS characterGroupName,
					COLLECT(
						CASE character WHEN NULL
							THEN null
							ELSE {
								name: COALESCE(characterRel.displayName, character.name),
								underlyingName: CASE characterRel.displayName WHEN NULL THEN null ELSE character.name END,
								differentiator: character.differentiator,
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
						differentiator: CASE originalVersionMaterial.differentiator WHEN NULL THEN '' ELSE originalVersionMaterial.differentiator END
					} AS originalVersionMaterial,
					writerGroups,
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

				OPTIONAL MATCH (material)-[writerRel:WRITTEN_BY]->(:Person)

				DELETE writerRel

				WITH DISTINCT material

				OPTIONAL MATCH (material)-[sourceMaterialRel:USES_SOURCE_MATERIAL]->(:Material)

				DELETE sourceMaterialRel

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
						($originalVersionMaterial.differentiator IS NULL AND existingOriginalVersionMaterial.differentiator IS NULL) OR
						($originalVersionMaterial.differentiator = existingOriginalVersionMaterial.differentiator)

				WITH
					material,
					CASE existingOriginalVersionMaterial WHEN NULL
						THEN {
							uuid: $originalVersionMaterial.uuid,
							name: $originalVersionMaterial.name,
							differentiator: $originalVersionMaterial.differentiator
						}
						ELSE existingOriginalVersionMaterial
					END AS originalVersionMaterialProps

				FOREACH (item IN CASE $originalVersionMaterial.name WHEN NULL THEN [] ELSE [1] END |
					MERGE (originalVersionMaterial:Material {
						uuid: originalVersionMaterialProps.uuid,
						name: originalVersionMaterialProps.name
					})
						ON CREATE SET originalVersionMaterial.differentiator = originalVersionMaterialProps.differentiator

					CREATE (material)-[:SUBSEQUENT_VERSION_OF]->(originalVersionMaterial)
				)

				WITH material

				UNWIND (CASE $writerGroups WHEN [] THEN [{ writers: [] }] ELSE $writerGroups END) AS writerGroupParam

					UNWIND
						CASE SIZE([writer IN writerGroupParam.writers WHERE writer.model = 'person']) WHEN 0
							THEN [null]
							ELSE [writer IN writerGroupParam.writers WHERE writer.model = 'person']
						END AS writerParam

						OPTIONAL MATCH (existingWriter:Person { name: writerParam.name })
							WHERE
								(writerParam.differentiator IS NULL AND existingWriter.differentiator IS NULL) OR
								(writerParam.differentiator = existingWriter.differentiator)

						WITH
							material,
							writerGroupParam,
							writerParam,
							CASE existingWriter WHEN NULL
								THEN {
									uuid: writerParam.uuid,
									name: writerParam.name,
									differentiator: writerParam.differentiator
								}
								ELSE existingWriter
							END AS writerProps

						FOREACH (item IN CASE WHEN writerParam IS NOT NULL AND writerParam.model = 'person' THEN [1] ELSE [] END |
							MERGE (writer:Person { uuid: writerProps.uuid, name: writerProps.name })
								ON CREATE SET writer.differentiator = writerProps.differentiator

							CREATE (material)-
								[:WRITTEN_BY {
									groupPosition: writerGroupParam.position,
									writerPosition: writerParam.position,
									group: writerGroupParam.name,
									isOriginalVersionWriter: writerGroupParam.isOriginalVersionWriter
								}]->(writer)
						)

					WITH DISTINCT material, writerGroupParam

					UNWIND
						CASE SIZE([writer IN writerGroupParam.writers WHERE writer.model = 'material']) WHEN 0
							THEN [null]
							ELSE [writer IN writerGroupParam.writers WHERE writer.model = 'material']
						END AS sourceMaterialParam

						OPTIONAL MATCH (existingSourceMaterial:Material { name: sourceMaterialParam.name })
							WHERE
								(sourceMaterialParam.differentiator IS NULL AND existingSourceMaterial.differentiator IS NULL) OR
								(sourceMaterialParam.differentiator = existingSourceMaterial.differentiator)

						WITH
							material,
							writerGroupParam,
							sourceMaterialParam,
							CASE existingSourceMaterial WHEN NULL
								THEN {
									uuid: sourceMaterialParam.uuid,
									name: sourceMaterialParam.name,
									differentiator: sourceMaterialParam.differentiator
								}
								ELSE existingSourceMaterial
							END AS sourceMaterialProps

						FOREACH (item IN CASE WHEN sourceMaterialParam IS NOT NULL AND sourceMaterialParam.model = 'material' THEN [1] ELSE [] END |
							MERGE (sourceMaterial:Material { uuid: sourceMaterialProps.uuid, name: sourceMaterialProps.name })
								ON CREATE SET sourceMaterial.differentiator = sourceMaterialProps.differentiator

							CREATE (material)-
								[:USES_SOURCE_MATERIAL {
									groupPosition: writerGroupParam.position,
									writerPosition: sourceMaterialParam.position,
									group: writerGroupParam.name
								}]->(sourceMaterial)
						)

				WITH DISTINCT material

				UNWIND (CASE $characterGroups WHEN [] THEN [{ characters: [] }] ELSE $characterGroups END) AS characterGroupParam

					UNWIND (CASE characterGroupParam.characters WHEN [] THEN [null] ELSE characterGroupParam.characters END) AS characterParam

						OPTIONAL MATCH (existingCharacter:Character {
							name: COALESCE(characterParam.underlyingName, characterParam.name)
						})
							WHERE
								(characterParam.differentiator IS NULL AND existingCharacter.differentiator IS NULL) OR
								(characterParam.differentiator = existingCharacter.differentiator)

						WITH
							material,
							characterGroupParam,
							characterParam,
							CASE existingCharacter WHEN NULL
								THEN {
									uuid: characterParam.uuid,
									name: COALESCE(characterParam.underlyingName, characterParam.name),
									differentiator: characterParam.differentiator
								}
								ELSE existingCharacter
							END AS characterProps

						FOREACH (item IN CASE characterParam WHEN NULL THEN [] ELSE [1] END |
							MERGE (character:Character { uuid: characterProps.uuid, name: characterProps.name })
								ON CREATE SET character.differentiator = characterProps.differentiator

							CREATE (material)-
								[:INCLUDES_CHARACTER {
									groupPosition: characterGroupParam.position,
									characterPosition: characterParam.position,
									displayName: CASE characterParam.underlyingName WHEN NULL THEN null ELSE characterParam.name END,
									qualifier: characterParam.qualifier,
									group: characterGroupParam.name
								}]->(character)
						)

				WITH DISTINCT material

				MATCH (material:Material { uuid: $uuid })

				OPTIONAL MATCH (material)-[:SUBSEQUENT_VERSION_OF]->(originalVersionMaterial:Material)

				OPTIONAL MATCH (material)-[writerRel:WRITTEN_BY|USES_SOURCE_MATERIAL]->(writer)
					WHERE writer:Person OR writer:Material

				WITH material, originalVersionMaterial, writerRel, writer
					ORDER BY writerRel.groupPosition, writerRel.writerPosition

				WITH
					material,
					originalVersionMaterial,
					writerRel.group AS writerGroupName,
					writerRel.isOriginalVersionWriter AS isOriginalVersionWriter,
					COLLECT(
						CASE writer WHEN NULL
							THEN null
							ELSE { model: TOLOWER(HEAD(LABELS(writer))), name: writer.name, differentiator: writer.differentiator }
						END
					) + [{}] AS writers

				WITH material, originalVersionMaterial,
					COLLECT(
						CASE WHEN writerGroupName IS NULL AND SIZE(writers) = 1
							THEN null
							ELSE {
								model: 'writerGroup',
								name: writerGroupName,
								isOriginalVersionWriter: isOriginalVersionWriter,
								writers: writers
							}
						END
					) + [{ writers: [{}] }] AS writerGroups

				OPTIONAL MATCH (material)-[characterRel:INCLUDES_CHARACTER]->(character:Character)

				WITH material, originalVersionMaterial, writerGroups, characterRel, character
					ORDER BY characterRel.groupPosition, characterRel.characterPosition

				WITH material, originalVersionMaterial, writerGroups, characterRel.group AS characterGroupName,
					COLLECT(
						CASE character WHEN NULL
							THEN null
							ELSE {
								name: COALESCE(characterRel.displayName, character.name),
								underlyingName: CASE characterRel.displayName WHEN NULL THEN null ELSE character.name END,
								differentiator: character.differentiator,
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
						differentiator: CASE originalVersionMaterial.differentiator WHEN NULL THEN '' ELSE originalVersionMaterial.differentiator END
					} AS originalVersionMaterial,
					writerGroups,
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
