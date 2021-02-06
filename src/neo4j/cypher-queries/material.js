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

				FOREACH (item IN CASE WHEN writingEntityParam IS NOT NULL THEN [1] ELSE [] END |
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
							creditType: writingCredit.creditType
						}]->(entity)
				)

			WITH DISTINCT material, writingCredit

			UNWIND
				CASE SIZE([entity IN writingCredit.writingEntities WHERE entity.model = 'company']) WHEN 0
					THEN [null]
					ELSE [entity IN writingCredit.writingEntities WHERE entity.model = 'company']
				END AS writingEntityParam

				OPTIONAL MATCH (existingWriter:Company { name: writingEntityParam.name })
					WHERE
						(writingEntityParam.differentiator IS NULL AND existingWriter.differentiator IS NULL) OR
						(writingEntityParam.differentiator = existingWriter.differentiator)

				FOREACH (item IN CASE WHEN writingEntityParam IS NOT NULL THEN [1] ELSE [] END |
					MERGE (entity:Company {
						uuid: COALESCE(existingWriter.uuid, writingEntityParam.uuid),
						name: writingEntityParam.name
					})
						ON CREATE SET entity.differentiator = writingEntityParam.differentiator

					CREATE (material)-
						[:WRITTEN_BY {
							creditPosition: writingCredit.position,
							entityPosition: writingEntityParam.position,
							credit: writingCredit.name,
							creditType: writingCredit.creditType
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

				FOREACH (item IN CASE WHEN sourceMaterialParam IS NOT NULL THEN [1] ELSE [] END |
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

	OPTIONAL MATCH (material)-[:SUBSEQUENT_VERSION_OF]-(originalOrSubsequentVersionMaterial)

	OPTIONAL MATCH (material)<-[:USES_SOURCE_MATERIAL]-(sourcingMaterial:Material)

	WITH
		material,
		[material] + COLLECT(originalOrSubsequentVersionMaterial) + COLLECT(sourcingMaterial) AS relatedMaterials

	UNWIND (CASE relatedMaterials WHEN [] THEN [null] ELSE relatedMaterials END) AS relatedMaterial

		OPTIONAL MATCH (relatedMaterial)<-[originalVersionRel:SUBSEQUENT_VERSION_OF]-(material)

		OPTIONAL MATCH (relatedMaterial)-[subsequentVersionRel:SUBSEQUENT_VERSION_OF]->(material)

		OPTIONAL MATCH (relatedMaterial)-[sourcingMaterialRel:USES_SOURCE_MATERIAL]->(material)

		OPTIONAL MATCH (relatedMaterial)-[writingEntityRel:WRITTEN_BY|USES_SOURCE_MATERIAL]->(writingEntity)
			WHERE writingEntity:Person OR writingEntity:Company OR writingEntity:Material

		OPTIONAL MATCH (writingEntity)<-[originalVersionWritingEntityRel:WRITTEN_BY|USES_SOURCE_MATERIAL]-(material)

		OPTIONAL MATCH (writingEntity:Material)-[sourceMaterialWriterRel:WRITTEN_BY]->(sourceMaterialWriter)

		WITH
			material,
			relatedMaterial,
			CASE originalVersionRel WHEN NULL THEN false ELSE true END AS isOriginalVersion,
			CASE subsequentVersionRel WHEN NULL THEN false ELSE true END AS isSubsequentVersion,
			CASE sourcingMaterialRel WHEN NULL THEN false ELSE true END AS isSourcingMaterial,
			writingEntityRel,
			writingEntity,
			CASE originalVersionWritingEntityRel WHEN NULL THEN false ELSE true END AS isOriginalVersionWritingEntity,
			sourceMaterialWriterRel,
			sourceMaterialWriter
			ORDER BY sourceMaterialWriterRel.creditPosition, sourceMaterialWriterRel.entityPosition

		WITH
			material,
			relatedMaterial,
			isOriginalVersion,
			isSubsequentVersion,
			isSourcingMaterial,
			writingEntityRel,
			writingEntity,
			isOriginalVersionWritingEntity,
			sourceMaterialWriterRel.credit AS sourceMaterialWritingCreditName,
			COLLECT(
				CASE WHEN sourceMaterialWriter IS NULL
					THEN null
					ELSE {
						model: TOLOWER(HEAD(LABELS(sourceMaterialWriter))),
						uuid: CASE sourceMaterialWriter.uuid WHEN material.uuid
							THEN null
							ELSE sourceMaterialWriter.uuid
						END,
						name: sourceMaterialWriter.name
					}
				END
			) AS sourceMaterialWriters

		WITH
			material,
			relatedMaterial,
			isOriginalVersion,
			isSubsequentVersion,
			isSourcingMaterial,
			writingEntityRel,
			writingEntity,
			isOriginalVersionWritingEntity,
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
			relatedMaterial,
			isOriginalVersion,
			isSubsequentVersion,
			isSourcingMaterial,
			writingEntityRel.credit AS writingCreditName,
			[writingEntity IN COLLECT(
				CASE WHEN writingEntity IS NULL OR (isSubsequentVersion AND isOriginalVersionWritingEntity)
					THEN null
					ELSE {
						model: TOLOWER(HEAD(LABELS(writingEntity))),
						uuid: CASE writingEntity.uuid WHEN material.uuid THEN null ELSE writingEntity.uuid END,
						name: writingEntity.name,
						format: writingEntity.format,
						sourceMaterialWritingCredits: sourceMaterialWritingCredits
					}
				END
			) | CASE writingEntity.model WHEN 'material'
				THEN writingEntity
				ELSE { model: writingEntity.model, uuid: writingEntity.uuid, name: writingEntity.name }
			END] AS writingEntities

		WITH material, relatedMaterial, isOriginalVersion, isSubsequentVersion, isSourcingMaterial,
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
			ORDER BY relatedMaterial.name

		WITH material,
			COLLECT(
				CASE relatedMaterial WHEN NULL
					THEN null
					ELSE {
						model: 'material',
						uuid: relatedMaterial.uuid,
						name: relatedMaterial.name,
						format: relatedMaterial.format,
						writingCredits: writingCredits,
						isOriginalVersion: isOriginalVersion,
						isSubsequentVersion: isSubsequentVersion,
						isSourcingMaterial: isSourcingMaterial
					}
				END
			) AS relatedMaterials

		WITH
			material,
			HEAD([
				relatedMaterial IN relatedMaterials
					WHERE relatedMaterial.uuid = material.uuid | relatedMaterial.writingCredits
			]) AS writingCredits,
			HEAD([
				relatedMaterial IN relatedMaterials WHERE relatedMaterial.isOriginalVersion |
				{
					model: relatedMaterial.model,
					uuid: relatedMaterial.uuid,
					name: relatedMaterial.name,
					format: relatedMaterial.format,
					writingCredits: relatedMaterial.writingCredits
				}
			]) AS originalVersionMaterial,
			[
				relatedMaterial IN relatedMaterials WHERE relatedMaterial.isSubsequentVersion |
				{
					model: relatedMaterial.model,
					uuid: relatedMaterial.uuid,
					name: relatedMaterial.name,
					format: relatedMaterial.format,
					writingCredits: relatedMaterial.writingCredits
				}
			] AS subsequentVersionMaterials,
			[
				relatedMaterial IN relatedMaterials WHERE relatedMaterial.isSourcingMaterial |
				{
					model: relatedMaterial.model,
					uuid: relatedMaterial.uuid,
					name: relatedMaterial.name,
					format: relatedMaterial.format,
					writingCredits: relatedMaterial.writingCredits
				}
			] AS sourcingMaterials

	OPTIONAL MATCH (material)-[characterRel:INCLUDES_CHARACTER]->(character:Character)

	WITH
		material,
		writingCredits,
		originalVersionMaterial,
		subsequentVersionMaterials,
		sourcingMaterials,
		characterRel,
		character
		ORDER BY characterRel.groupPosition, characterRel.characterPosition

	WITH
		material,
		writingCredits,
		originalVersionMaterial,
		subsequentVersionMaterials,
		sourcingMaterials,
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

	WITH material, writingCredits, originalVersionMaterial, subsequentVersionMaterials, sourcingMaterials,
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

	OPTIONAL MATCH (material)<-[:USES_SOURCE_MATERIAL|PRODUCTION_OF*1..2]-(production:Production)

	WITH
		material,
		writingCredits,
		originalVersionMaterial,
		subsequentVersionMaterials,
		sourcingMaterials,
		characterGroups,
		COLLECT(production) AS productions

	UNWIND (CASE productions WHEN [] THEN [null] ELSE productions END) AS production

		OPTIONAL MATCH (production)-[:PLAYS_AT]->(theatre:Theatre)

		OPTIONAL MATCH (theatre)<-[:INCLUDES_SUB_THEATRE]-(surTheatre:Theatre)

		OPTIONAL MATCH (material)<-[:USES_SOURCE_MATERIAL]-(:Material)<-[sourcingMaterialRel:PRODUCTION_OF]-(production)

		WITH
			material,
			writingCredits,
			originalVersionMaterial,
			subsequentVersionMaterials,
			sourcingMaterials,
			characterGroups,
			production,
			theatre,
			surTheatre,
			CASE sourcingMaterialRel WHEN NULL THEN false ELSE true END AS usesSourcingMaterial
			ORDER BY production.name, theatre.name

		WITH
			material,
			writingCredits,
			originalVersionMaterial,
			subsequentVersionMaterials,
			sourcingMaterials,
			characterGroups,
			COLLECT(
				CASE production WHEN NULL
					THEN null
					ELSE {
						model: 'production',
						uuid: production.uuid,
						name: production.name,
						usesSourcingMaterial: usesSourcingMaterial,
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

	RETURN
		'material' AS model,
		material.uuid AS uuid,
		material.name AS name,
		material.differentiator AS differentiator,
		material.format AS format,
		writingCredits,
		originalVersionMaterial,
		subsequentVersionMaterials,
		sourcingMaterials,
		characterGroups,
		[
			production IN productions WHERE NOT production.usesSourcingMaterial |
			{ model: production.model, uuid: production.uuid, name: production.name, theatre: production.theatre }
		] AS productions,
		[
			production IN productions WHERE production.usesSourcingMaterial |
			{ model: production.model, uuid: production.uuid, name: production.name, theatre: production.theatre }
		] AS sourcingMaterialProductions
	`;

const getListQuery = () => `
	MATCH (material:Material)

	OPTIONAL MATCH (material)-[writingEntityRel:WRITTEN_BY|USES_SOURCE_MATERIAL]->(writingEntity)
		WHERE writingEntity:Person OR writingEntity:Company OR writingEntity:Material

	OPTIONAL MATCH (writingEntity:Material)-[sourceMaterialWriterRel:WRITTEN_BY]->(sourceMaterialWriter)

	WITH material, writingEntityRel, writingEntity, sourceMaterialWriterRel, sourceMaterialWriter
		ORDER BY sourceMaterialWriterRel.creditPosition, sourceMaterialWriterRel.entityPosition

	WITH material, writingEntityRel, writingEntity, sourceMaterialWriterRel.credit AS sourceMaterialWritingCreditName,
		COLLECT(
			CASE sourceMaterialWriter WHEN NULL
				THEN null
				ELSE {
					model: TOLOWER(HEAD(LABELS(sourceMaterialWriter))),
					uuid: sourceMaterialWriter.uuid,
					name: sourceMaterialWriter.name
				}
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
		[writingEntity IN COLLECT(
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
		) | CASE writingEntity.model WHEN 'material'
			THEN writingEntity
			ELSE { model: writingEntity.model, uuid: writingEntity.uuid, name: writingEntity.name }
		END] AS writingEntities

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
