const getCreateUpdateQuery = action => {

	const createUpdateQueryOpeningMap = {
		create: `
			CREATE (material:Material { uuid: $uuid, name: $name, differentiator: $differentiator, format: $format })
		`,
		update: `
			MATCH (material:Material { uuid: $uuid })

			OPTIONAL MATCH (material)-[originalVersionMaterialRel:SUBSEQUENT_VERSION_OF]->(:Material)

			DELETE originalVersionMaterialRel

			WITH DISTINCT material

			OPTIONAL MATCH (material)-[writerRel:WRITTEN_BY]->(:Person)

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
		`
	};

	return `
		${createUpdateQueryOpeningMap[action]}

		WITH material

		OPTIONAL MATCH (existingOriginalVersionMaterial:Material { name: $originalVersionMaterial.name })
			WHERE
				($originalVersionMaterial.differentiator IS NULL AND existingOriginalVersionMaterial.differentiator IS NULL) OR
				($originalVersionMaterial.differentiator = existingOriginalVersionMaterial.differentiator)

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
				END AS writingEntityParam

				OPTIONAL MATCH (existingWriter:Person { name: writingEntityParam.name })
					WHERE
						(writingEntityParam.differentiator IS NULL AND existingWriter.differentiator IS NULL) OR
						(writingEntityParam.differentiator = existingWriter.differentiator)

				FOREACH (item IN CASE WHEN writingEntityParam IS NOT NULL AND writingEntityParam.model = 'person' THEN [1] ELSE [] END |
					MERGE (entity:Person {
						uuid: COALESCE(existingWriter.uuid, writingEntityParam.uuid),
						name: writingEntityParam.name
					})
						ON CREATE SET entity.differentiator = writingEntityParam.differentiator

					CREATE (material)-
						[:WRITTEN_BY {
							creditPosition: writingCredit.position,
							entityPosition: writingEntityParam.position,
							credit: writingCredit.name,
							isOriginalVersionCredit: writingCredit.isOriginalVersionCredit
						}]->(entity)
				)

			WITH DISTINCT material, writingCredit

			UNWIND
				CASE SIZE([entity IN writingCredit.writingEntities WHERE entity.model = 'material']) WHEN 0
					THEN [null]
					ELSE [entity IN writingCredit.writingEntities WHERE entity.model = 'material']
				END AS sourceMaterialParam

				OPTIONAL MATCH (existingSourceMaterial:Material { name: sourceMaterialParam.name })
					WHERE
						(sourceMaterialParam.differentiator IS NULL AND existingSourceMaterial.differentiator IS NULL) OR
						(sourceMaterialParam.differentiator = existingSourceMaterial.differentiator)

				FOREACH (item IN CASE WHEN sourceMaterialParam IS NOT NULL AND sourceMaterialParam.model = 'material' THEN [1] ELSE [] END |
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

			UNWIND (CASE characterGroup.characters WHEN [] THEN [null] ELSE characterGroup.characters END) AS characterParam

				OPTIONAL MATCH (existingCharacter:Character {
					name: COALESCE(characterParam.underlyingName, characterParam.name)
				})
					WHERE
						(characterParam.differentiator IS NULL AND existingCharacter.differentiator IS NULL) OR
						(characterParam.differentiator = existingCharacter.differentiator)

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
							displayName: CASE characterParam.underlyingName WHEN NULL THEN null ELSE characterParam.name END,
							qualifier: characterParam.qualifier,
							group: characterGroup.name
						}]->(character)
				)

		WITH DISTINCT material

		${getEditQuery()}
	`;

};

const getCreateQuery = () => getCreateUpdateQuery('create');

const getEditQuery = () => `
	MATCH (material:Material { uuid: $uuid })

	OPTIONAL MATCH (material)-[:SUBSEQUENT_VERSION_OF]->(originalVersionMaterial:Material)

	OPTIONAL MATCH (material)-[writingEntityRel:WRITTEN_BY|USES_SOURCE_MATERIAL]->(writingEntity)
		WHERE writingEntity:Person OR writingEntity:Material

	WITH material, originalVersionMaterial, writingEntityRel, writingEntity
		ORDER BY writingEntityRel.creditPosition, writingEntityRel.entityPosition

	WITH
		material,
		originalVersionMaterial,
		writingEntityRel.credit AS writingCreditName,
		writingEntityRel.isOriginalVersionCredit AS isOriginalVersionCredit,
		COLLECT(
			CASE writingEntity WHEN NULL
				THEN null
				ELSE {
					model: TOLOWER(HEAD(LABELS(writingEntity))),
					name: writingEntity.name,
					differentiator: writingEntity.differentiator
				}
			END
		) + [{}] AS writingEntities

	WITH material, originalVersionMaterial,
		COLLECT(
			CASE WHEN writingCreditName IS NULL AND SIZE(writingEntities) = 1
				THEN null
				ELSE {
					model: 'writingCredit',
					name: writingCreditName,
					isOriginalVersionCredit: isOriginalVersionCredit,
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
		writingCredits,
		COLLECT(
			CASE WHEN characterGroupName IS NULL AND SIZE(characters) = 1
				THEN null
				ELSE { model: 'characterGroup', name: characterGroupName, characters: characters }
			END
		) + [{ characters: [{}] }] AS characterGroups
`;

const getUpdateQuery = () => getCreateUpdateQuery('update');

const getShowQuery = () => `
	MATCH (material:Material { uuid: $uuid })

	OPTIONAL MATCH (material)-[:SUBSEQUENT_VERSION_OF]->(originalVersionMaterial:Material)

	OPTIONAL MATCH (originalVersionMaterial)-[originalVersionMaterialWriterRel:WRITTEN_BY]->
		(originalVersionMaterialWriter:Person)

	WITH
		material,
		originalVersionMaterial,
		originalVersionMaterialWriterRel,
		originalVersionMaterialWriter
		ORDER BY originalVersionMaterialWriterRel.creditPosition, originalVersionMaterialWriterRel.entityPosition

	WITH
		material,
		originalVersionMaterial,
		originalVersionMaterialWriterRel.credit AS originalVersionMaterialWritingCreditName,
		COLLECT(
			CASE originalVersionMaterialWriter WHEN NULL
				THEN null
				ELSE {
					model: 'person',
					uuid: originalVersionMaterialWriter.uuid,
					name: originalVersionMaterialWriter.name
				}
			END
		) AS originalVersionMaterialWriters

	WITH
		material,
		originalVersionMaterial,
		COLLECT(
			CASE SIZE(originalVersionMaterialWriters) WHEN 0
				THEN null
				ELSE {
					model: 'writingCredit',
					name: COALESCE(originalVersionMaterialWritingCreditName, 'by'),
					writingEntities: originalVersionMaterialWriters
				}
			END
		) AS originalVersionMaterialWritingCredits

	WITH
		material,
		CASE originalVersionMaterial WHEN NULL
			THEN null
			ELSE {
				model: 'material',
				uuid: originalVersionMaterial.uuid,
				name: originalVersionMaterial.name,
				format: originalVersionMaterial.format,
				writingCredits: originalVersionMaterialWritingCredits
			}
		END AS originalVersionMaterial

	OPTIONAL MATCH (material)<-[:SUBSEQUENT_VERSION_OF]-(subsequentVersionMaterial:Material)

	OPTIONAL MATCH (subsequentVersionMaterial)-[subsequentVersionMaterialWriterRel:WRITTEN_BY]->
		(subsequentVersionMaterialWriter:Person)
		WHERE subsequentVersionMaterialWriterRel.isOriginalVersionCredit IS NULL

	WITH
		material,
		originalVersionMaterial,
		subsequentVersionMaterial,
		subsequentVersionMaterialWriterRel,
		subsequentVersionMaterialWriter
		ORDER BY subsequentVersionMaterialWriterRel.creditPosition, subsequentVersionMaterialWriterRel.entityPosition

	WITH
		material,
		originalVersionMaterial,
		subsequentVersionMaterial,
		subsequentVersionMaterialWriterRel.credit AS subsequentVersionMaterialWritingCreditName,
		COLLECT(
			CASE subsequentVersionMaterialWriter WHEN NULL
				THEN null
				ELSE {
					model: 'person',
					uuid: subsequentVersionMaterialWriter.uuid,
					name: subsequentVersionMaterialWriter.name
				}
			END
		) AS subsequentVersionMaterialWriters

	WITH
		material,
		originalVersionMaterial,
		subsequentVersionMaterial,
		COLLECT(
			CASE SIZE(subsequentVersionMaterialWriters) WHEN 0
				THEN null
				ELSE {
					model: 'writingCredit',
					name: COALESCE(subsequentVersionMaterialWritingCreditName, 'by'),
					writingEntities: subsequentVersionMaterialWriters
				}
			END
		) AS subsequentVersionMaterialWritingCredits

	WITH
		material,
		originalVersionMaterial,
		COLLECT(
			CASE subsequentVersionMaterial WHEN NULL
				THEN null
				ELSE {
					model: 'material',
					uuid: subsequentVersionMaterial.uuid,
					name: subsequentVersionMaterial.name,
					format: subsequentVersionMaterial.format,
					writingCredits: subsequentVersionMaterialWritingCredits
				}
			END
		) AS subsequentVersionMaterials

	OPTIONAL MATCH (material)<-[:USES_SOURCE_MATERIAL]-(sourcingMaterial:Material)

	OPTIONAL MATCH (sourcingMaterial)-[sourcingMaterialWritingEntityRel:WRITTEN_BY|USES_SOURCE_MATERIAL]->
		(sourcingMaterialWritingEntity)
		WHERE sourcingMaterialWritingEntity:Person OR sourcingMaterialWritingEntity:Material

	WITH
		material,
		originalVersionMaterial,
		subsequentVersionMaterials,
		sourcingMaterial,
		sourcingMaterialWritingEntityRel,
		sourcingMaterialWritingEntity
		ORDER BY sourcingMaterialWritingEntityRel.creditPosition, sourcingMaterialWritingEntityRel.entityPosition

	WITH
		material,
		originalVersionMaterial,
		subsequentVersionMaterials,
		sourcingMaterial,
		sourcingMaterialWritingEntityRel.credit AS sourcingMaterialWritingCreditName,
		COLLECT(
			CASE sourcingMaterialWritingEntity WHEN NULL
				THEN null
				ELSE {
					model: TOLOWER(HEAD(LABELS(sourcingMaterialWritingEntity))),
					uuid: CASE WHEN sourcingMaterialWritingEntity.uuid = material.uuid
						THEN null
						ELSE sourcingMaterialWritingEntity.uuid
					END,
					name: sourcingMaterialWritingEntity.name,
					format: sourcingMaterialWritingEntity.format
				}
			END
		) AS sourcingMaterialWritingEntities

	WITH
		material,
		originalVersionMaterial,
		subsequentVersionMaterials,
		sourcingMaterial,
		COLLECT(
			CASE SIZE(sourcingMaterialWritingEntities) WHEN 0
				THEN null
				ELSE {
					model: 'writingCredit',
					name: COALESCE(sourcingMaterialWritingCreditName, 'by'),
					writingEntities: sourcingMaterialWritingEntities
				}
			END
		) AS sourcingMaterialWritingCredits

	WITH
		material,
		originalVersionMaterial,
		subsequentVersionMaterials,
		COLLECT(
			CASE sourcingMaterial WHEN NULL
				THEN null
				ELSE {
					model: 'material',
					uuid: sourcingMaterial.uuid,
					name: sourcingMaterial.name,
					format: sourcingMaterial.format,
					writingCredits: sourcingMaterialWritingCredits
				}
			END
		) AS sourcingMaterials

	OPTIONAL MATCH (material)-[writingEntityRel:WRITTEN_BY|USES_SOURCE_MATERIAL]->(writingEntity)
		WHERE writingEntity:Person OR writingEntity:Material

	OPTIONAL MATCH (writingEntity:Material)-[sourceMaterialWriterRel:WRITTEN_BY]->(sourceMaterialWriter)

	WITH
		material,
		originalVersionMaterial,
		subsequentVersionMaterials,
		sourcingMaterials,
		writingEntityRel,
		writingEntity,
		sourceMaterialWriterRel,
		sourceMaterialWriter
		ORDER BY sourceMaterialWriterRel.creditPosition, sourceMaterialWriter.entityPosition

	WITH
		material,
		originalVersionMaterial,
		subsequentVersionMaterials,
		sourcingMaterials,
		writingEntityRel,
		writingEntity,
		sourceMaterialWriterRel.credit AS sourceMaterialWritingCreditName,
		COLLECT(
			CASE sourceMaterialWriter WHEN NULL
				THEN null
				ELSE { model: 'person', uuid: sourceMaterialWriter.uuid, name: sourceMaterialWriter.name }
			END
		) AS sourceMaterialWriters

	WITH
		material,
		originalVersionMaterial,
		subsequentVersionMaterials,
		sourcingMaterials,
		writingEntityRel,
		writingEntity,
		COLLECT(
			CASE SIZE(sourceMaterialWriters) WHEN 0
				THEN null
				ELSE {
					model: 'writingCredit',
					name: COALESCE(sourceMaterialWritingCreditName, 'by'),
					writingEntities: sourceMaterialWriters
				}
			END
		) AS sourceMaterialWritingCredits
		ORDER BY writingEntityRel.creditPosition, writingEntityRel.entityPosition

	WITH
		material,
		originalVersionMaterial,
		subsequentVersionMaterials,
		sourcingMaterials,
		writingEntityRel.credit AS writingCreditName,
		COLLECT(
			CASE writingEntity WHEN NULL
				THEN null
				ELSE {
					model: TOLOWER(HEAD(LABELS(writingEntity))),
					uuid: writingEntity.uuid,
					name: writingEntity.name,
					format: writingEntity.format,
					sourceMaterialWritingCredits: sourceMaterialWritingCredits
				}
			END
		) AS writingEntities

	WITH material, originalVersionMaterial, subsequentVersionMaterials, sourcingMaterials,
		COLLECT(
			CASE SIZE(writingEntities) WHEN 0
				THEN null
				ELSE {
					model: 'writingCredit',
					name: COALESCE(writingCreditName, 'by'),
					writingEntities: writingEntities
				}
			END
		) AS writingCredits

	OPTIONAL MATCH (material)-[characterRel:INCLUDES_CHARACTER]->(character:Character)

	WITH
		material,
		originalVersionMaterial,
		subsequentVersionMaterials,
		sourcingMaterials,
		writingCredits,
		characterRel,
		character
		ORDER BY characterRel.groupPosition, characterRel.characterPosition

	WITH
		material,
		originalVersionMaterial,
		subsequentVersionMaterials,
		sourcingMaterials,
		writingCredits,
		characterRel.group AS characterGroupName,
		characterRel.groupPosition AS characterGroupPosition,
		COLLECT(
			CASE character WHEN NULL
				THEN null
				ELSE {
					model: 'character',
					uuid: character.uuid,
					name: COALESCE(characterRel.displayName, character.name),
					qualifier: characterRel.qualifier
				}
			END
		) AS characters

	WITH material, originalVersionMaterial, subsequentVersionMaterials, sourcingMaterials, writingCredits,
		COLLECT(
			CASE SIZE(characters) WHEN 0
				THEN null
				ELSE {
					model: 'characterGroup',
					name: characterGroupName,
					position: characterGroupPosition,
					characters: characters
				}
			END
		) AS characterGroups

	OPTIONAL MATCH (material)<-[:PRODUCTION_OF]-(production:Production)

	OPTIONAL MATCH (production)-[:PLAYS_AT]->(theatre:Theatre)

	OPTIONAL MATCH (theatre)<-[:INCLUDES_SUB_THEATRE]-(surTheatre:Theatre)

	WITH
		material,
		originalVersionMaterial,
		subsequentVersionMaterials,
		sourcingMaterials,
		writingCredits,
		characterGroups,
		production,
		theatre,
		surTheatre
		ORDER BY production.name, theatre.name

	WITH
		material,
		originalVersionMaterial,
		subsequentVersionMaterials,
		sourcingMaterials,
		writingCredits,
		characterGroups,
		COLLECT(
			CASE production WHEN NULL
				THEN null
				ELSE {
					model: 'production',
					uuid: production.uuid,
					name: production.name,
					theatre: CASE theatre WHEN NULL
						THEN null
						ELSE {
							model: 'theatre',
							uuid: theatre.uuid,
							name: theatre.name,
							surTheatre: CASE surTheatre WHEN NULL
								THEN null
								ELSE {
									model: 'theatre',
									uuid: surTheatre.uuid,
									name: surTheatre.name
								}
							END
						}
					END
				}
			END
		) AS productions

	OPTIONAL MATCH (material)<-[:USES_SOURCE_MATERIAL]-(:Material)
		<-[:PRODUCTION_OF]-(sourcingMaterialProduction:Production)

	OPTIONAL MATCH (sourcingMaterialProduction)-[:PLAYS_AT]->(sourcingMaterialProductionTheatre:Theatre)

	OPTIONAL MATCH (sourcingMaterialProductionTheatre)
		<-[:INCLUDES_SUB_THEATRE]-(sourcingMaterialProductionSurTheatre:Theatre)

	WITH
		material,
		originalVersionMaterial,
		subsequentVersionMaterials,
		sourcingMaterials,
		writingCredits,
		characterGroups,
		productions,
		sourcingMaterialProduction,
		sourcingMaterialProductionTheatre,
		sourcingMaterialProductionSurTheatre
		ORDER BY sourcingMaterialProduction.name, sourcingMaterialProductionTheatre.name

	RETURN
		'material' AS model,
		material.uuid AS uuid,
		material.name AS name,
		material.differentiator AS differentiator,
		material.format AS format,
		originalVersionMaterial,
		subsequentVersionMaterials,
		sourcingMaterials,
		writingCredits,
		characterGroups,
		productions,
		COLLECT(
			CASE sourcingMaterialProduction WHEN NULL
				THEN null
				ELSE {
					model: 'production',
					uuid: sourcingMaterialProduction.uuid,
					name: sourcingMaterialProduction.name,
					theatre: CASE sourcingMaterialProductionTheatre WHEN NULL
						THEN null
						ELSE {
							model: 'theatre',
							uuid: sourcingMaterialProductionTheatre.uuid,
							name: sourcingMaterialProductionTheatre.name,
							surTheatre: CASE sourcingMaterialProductionSurTheatre WHEN NULL
								THEN null
								ELSE {
									model: 'theatre',
									uuid: sourcingMaterialProductionSurTheatre.uuid,
									name: sourcingMaterialProductionSurTheatre.name
								}
							END
						}
					END
				}
			END
		) AS sourcingMaterialProductions
	`;

const getListQuery = () => `
	MATCH (material:Material)

	OPTIONAL MATCH (material)-[writingEntityRel:WRITTEN_BY|USES_SOURCE_MATERIAL]->(writingEntity)
		WHERE writingEntity:Person OR writingEntity:Material

	OPTIONAL MATCH (writingEntity:Material)-[sourceMaterialWriterRel:WRITTEN_BY]->(sourceMaterialWriter)

	WITH material, writingEntityRel, writingEntity, sourceMaterialWriterRel, sourceMaterialWriter
		ORDER BY sourceMaterialWriterRel.creditPosition, sourceMaterialWriter.entityPosition

	WITH material, writingEntityRel, writingEntity, sourceMaterialWriterRel.credit AS sourceMaterialWritingCreditName,
		COLLECT(
			CASE sourceMaterialWriter WHEN NULL
				THEN null
				ELSE { model: 'person', uuid: sourceMaterialWriter.uuid, name: sourceMaterialWriter.name }
			END
		) AS sourceMaterialWriters

	WITH material, writingEntityRel, writingEntity,
		COLLECT(
			CASE SIZE(sourceMaterialWriters) WHEN 0
				THEN null
				ELSE {
					model: 'writingCredit',
					name: COALESCE(sourceMaterialWritingCreditName, 'by'),
					writingEntities: sourceMaterialWriters
				}
			END
		) AS sourceMaterialWritingCredits
		ORDER BY writingEntityRel.creditPosition, writingEntityRel.entityPosition

	WITH material, writingEntityRel.credit AS writingCreditName,
		COLLECT(
			CASE writingEntity WHEN NULL
				THEN null
				ELSE {
					model: TOLOWER(HEAD(LABELS(writingEntity))),
					uuid: writingEntity.uuid,
					name: writingEntity.name,
					format: writingEntity.format,
					sourceMaterialWritingCredits: sourceMaterialWritingCredits
				}
			END
		) AS writingEntities

	WITH material, writingCreditName, writingEntities
		ORDER BY material.name, material.differentiator

	RETURN
		'material' AS model,
		material.uuid AS uuid,
		material.name AS name,
		material.format AS format,
		COLLECT(
			CASE SIZE(writingEntities) WHEN 0
				THEN null
				ELSE {
					model: 'writingCredit',
					name: COALESCE(writingCreditName, 'by'),
					writingEntities: writingEntities
				}
			END
		) AS writingCredits

	LIMIT 100
`;

export {
	getCreateQuery,
	getEditQuery,
	getUpdateQuery,
	getShowQuery,
	getListQuery
};
