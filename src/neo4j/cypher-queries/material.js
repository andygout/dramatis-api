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
				material.format = $format
		`
	};

	return `
		${createUpdateQueryOpeningMap[action]}

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

		UNWIND (CASE $writingCredits WHEN [] THEN [{ entities: [] }] ELSE $writingCredits END) AS writingCredit

			UNWIND
				CASE SIZE([entity IN writingCredit.entities WHERE entity.model = 'person']) WHEN 0
					THEN [null]
					ELSE [entity IN writingCredit.entities WHERE entity.model = 'person']
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
						[:HAS_WRITING_ENTITY {
							creditPosition: writingCredit.position,
							entityPosition: writingPersonParam.position,
							credit: writingCredit.name,
							creditType: writingCredit.creditType
						}]->(writingPerson)
				)

			WITH DISTINCT material, writingCredit

			UNWIND
				CASE SIZE([entity IN writingCredit.entities WHERE entity.model = 'company']) WHEN 0
					THEN [null]
					ELSE [entity IN writingCredit.entities WHERE entity.model = 'company']
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
						[:HAS_WRITING_ENTITY {
							creditPosition: writingCredit.position,
							entityPosition: writingCompanyParam.position,
							credit: writingCredit.name,
							creditType: writingCredit.creditType
						}]->(writingCompany)
				)

			WITH DISTINCT material, writingCredit

			UNWIND
				CASE SIZE([entity IN writingCredit.entities WHERE entity.model = 'material']) WHEN 0
					THEN [null]
					ELSE [entity IN writingCredit.entities WHERE entity.model = 'material']
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
						[:HAS_CHARACTER {
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

		${getEditQuery()}
	`;

};

const getCreateQuery = () => getCreateUpdateQuery('create');

const getEditQuery = () => `
	MATCH (material:Material { uuid: $uuid })

	OPTIONAL MATCH (material)-[:SUBSEQUENT_VERSION_OF]->(originalVersionMaterial:Material)

	OPTIONAL MATCH (material)-[entityRel:HAS_WRITING_ENTITY|USES_SOURCE_MATERIAL]->(entity)
		WHERE entity:Person OR entity:Company OR entity:Material

	WITH material, originalVersionMaterial, entityRel, entity
		ORDER BY entityRel.creditPosition, entityRel.entityPosition

	WITH
		material,
		originalVersionMaterial,
		entityRel.credit AS writingCreditName,
		entityRel.creditType AS writingCreditType,
		COLLECT(
			CASE entity WHEN NULL
				THEN null
				ELSE entity { model: TOLOWER(HEAD(LABELS(entity))), .name, .differentiator }
			END
		) + [{}] AS entities

	WITH material, originalVersionMaterial,
		COLLECT(
			CASE WHEN writingCreditName IS NULL AND SIZE(entities) = 1
				THEN null
				ELSE {
					model: 'writingCredit',
					name: writingCreditName,
					creditType: writingCreditType,
					entities: entities
				}
			END
		) + [{ entities: [{}] }] AS writingCredits

	OPTIONAL MATCH (material)-[characterRel:HAS_CHARACTER]->(character:Character)

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
			name: COALESCE(originalVersionMaterial.name, ''),
			differentiator: COALESCE(originalVersionMaterial.differentiator, '')
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

		OPTIONAL MATCH (relatedMaterial)-[entityRel:HAS_WRITING_ENTITY|USES_SOURCE_MATERIAL]->(entity)
			WHERE entity:Person OR entity:Company OR entity:Material

		OPTIONAL MATCH (entity)<-[originalVersionWritingEntityRel:HAS_WRITING_ENTITY|USES_SOURCE_MATERIAL]-(material)

		OPTIONAL MATCH (entity:Material)-[sourceMaterialWriterRel:HAS_WRITING_ENTITY]->(sourceMaterialWriter)
			WHERE sourceMaterialWriter:Person OR sourceMaterialWriter:Company

		WITH
			material,
			relatedMaterial,
			CASE originalVersionRel WHEN NULL THEN false ELSE true END AS isOriginalVersion,
			CASE subsequentVersionRel WHEN NULL THEN false ELSE true END AS isSubsequentVersion,
			CASE sourcingMaterialRel WHEN NULL THEN false ELSE true END AS isSourcingMaterial,
			entityRel,
			entity,
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
			entityRel,
			entity,
			isOriginalVersionWritingEntity,
			sourceMaterialWriterRel.credit AS sourceMaterialWritingCreditName,
			COLLECT(
				CASE sourceMaterialWriter WHEN NULL
					THEN null
					ELSE sourceMaterialWriter {
						model: TOLOWER(HEAD(LABELS(sourceMaterialWriter))),
						uuid: CASE sourceMaterialWriter.uuid WHEN material.uuid
							THEN null
							ELSE sourceMaterialWriter.uuid
						END,
						.name
					}
				END
			) AS sourceMaterialWriters

		WITH
			material,
			relatedMaterial,
			isOriginalVersion,
			isSubsequentVersion,
			isSourcingMaterial,
			entityRel,
			entity,
			isOriginalVersionWritingEntity,
			COLLECT(
				CASE SIZE(sourceMaterialWriters) WHEN 0
					THEN null
					ELSE {
						model: 'writingCredit',
						name: COALESCE(sourceMaterialWritingCreditName, 'by'),
						entities: sourceMaterialWriters
					}
				END
			) AS sourceMaterialWritingCredits
			ORDER BY entityRel.creditPosition, entityRel.entityPosition

		WITH
			material,
			relatedMaterial,
			isOriginalVersion,
			isSubsequentVersion,
			isSourcingMaterial,
			entityRel.credit AS writingCreditName,
			[entity IN COLLECT(
				CASE WHEN entity IS NULL OR (isSubsequentVersion AND isOriginalVersionWritingEntity)
					THEN null
					ELSE entity {
						model: TOLOWER(HEAD(LABELS(entity))),
						uuid: CASE entity.uuid WHEN material.uuid THEN null ELSE entity.uuid END,
						.name,
						.format,
						writingCredits: sourceMaterialWritingCredits
					}
				END
			) | CASE entity.model WHEN 'material'
				THEN entity
				ELSE entity { .model, .uuid, .name }
			END] AS entities

		WITH material, relatedMaterial, isOriginalVersion, isSubsequentVersion, isSourcingMaterial,
			COLLECT(
				CASE SIZE(entities) WHEN 0
					THEN null
					ELSE {
						model: 'writingCredit',
						name: COALESCE(writingCreditName, 'by'),
						entities: entities
					}
				END
			) AS writingCredits
			ORDER BY relatedMaterial.name

		WITH material,
			COLLECT(
				CASE relatedMaterial WHEN NULL
					THEN null
					ELSE relatedMaterial {
						model: 'material',
						.uuid,
						.name,
						.format,
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
				relatedMaterial { .model, .uuid, .name, .format, .writingCredits }
			]) AS originalVersionMaterial,
			[
				relatedMaterial IN relatedMaterials WHERE relatedMaterial.isSubsequentVersion |
				relatedMaterial { .model, .uuid, .name, .format, .writingCredits }
			] AS subsequentVersionMaterials,
			[
				relatedMaterial IN relatedMaterials WHERE relatedMaterial.isSourcingMaterial |
				relatedMaterial { .model, .uuid, .name, .format, .writingCredits }
			] AS sourcingMaterials

	OPTIONAL MATCH (material)-[characterRel:HAS_CHARACTER]->(character:Character)

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
				ELSE character {
					model: 'character',
					.uuid,
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

		OPTIONAL MATCH (production)-[:PLAYS_AT]->(venue:Venue)

		OPTIONAL MATCH (venue)<-[:HAS_SUB_VENUE]-(surVenue:Venue)

		OPTIONAL MATCH (material)<-[:USES_SOURCE_MATERIAL]-(:Material)<-[sourcingMaterialRel:PRODUCTION_OF]-(production)

		WITH
			material,
			writingCredits,
			originalVersionMaterial,
			subsequentVersionMaterials,
			sourcingMaterials,
			characterGroups,
			production,
			venue,
			surVenue,
			CASE sourcingMaterialRel WHEN NULL THEN false ELSE true END AS usesSourcingMaterial
			ORDER BY production.startDate DESC, production.name, venue.name

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
					ELSE production {
						model: 'production',
						.uuid,
						.name,
						.startDate,
						.endDate,
						usesSourcingMaterial: usesSourcingMaterial,
						venue: CASE venue WHEN NULL
							THEN null
							ELSE venue {
								model: 'venue',
								.uuid,
								.name,
								surVenue: CASE surVenue WHEN NULL
									THEN null
									ELSE surVenue { model: 'venue', .uuid, .name }
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
			production { .model, .uuid, .name, .startDate, .endDate, .venue }
		] AS productions,
		[
			production IN productions WHERE production.usesSourcingMaterial |
			production { .model, .uuid, .name, .startDate, .endDate, .venue }
		] AS sourcingMaterialProductions
	`;

const getListQuery = () => `
	MATCH (material:Material)

	OPTIONAL MATCH (material)-[entityRel:HAS_WRITING_ENTITY|USES_SOURCE_MATERIAL]->(entity)
		WHERE entity:Person OR entity:Company OR entity:Material

	OPTIONAL MATCH (entity:Material)-[sourceMaterialWriterRel:HAS_WRITING_ENTITY]->(sourceMaterialWriter)
		WHERE sourceMaterialWriter:Person OR sourceMaterialWriter:Company

	WITH material, entityRel, entity, sourceMaterialWriterRel, sourceMaterialWriter
		ORDER BY sourceMaterialWriterRel.creditPosition, sourceMaterialWriterRel.entityPosition

	WITH material, entityRel, entity, sourceMaterialWriterRel.credit AS sourceMaterialWritingCreditName,
		COLLECT(
			CASE sourceMaterialWriter WHEN NULL
				THEN null
				ELSE sourceMaterialWriter { model: TOLOWER(HEAD(LABELS(sourceMaterialWriter))), .uuid, .name }
			END
		) AS sourceMaterialWriters

	WITH material, entityRel, entity,
		COLLECT(
			CASE SIZE(sourceMaterialWriters) WHEN 0
				THEN null
				ELSE {
					model: 'writingCredit',
					name: COALESCE(sourceMaterialWritingCreditName, 'by'),
					entities: sourceMaterialWriters
				}
			END
		) AS sourceMaterialWritingCredits
		ORDER BY entityRel.creditPosition, entityRel.entityPosition

	WITH material, entityRel.credit AS writingCreditName,
		[entity IN COLLECT(
			CASE entity WHEN NULL
				THEN null
				ELSE entity {
					model: TOLOWER(HEAD(LABELS(entity))),
					.uuid,
					.name,
					.format,
					writingCredits: sourceMaterialWritingCredits
				}
			END
		) | CASE entity.model WHEN 'material'
			THEN entity
			ELSE entity { .model, .uuid, .name }
		END] AS entities

	WITH material, writingCreditName, entities
		ORDER BY material.name, material.differentiator

	RETURN
		'material' AS model,
		material.uuid AS uuid,
		material.name AS name,
		material.format AS format,
		COLLECT(
			CASE SIZE(entities) WHEN 0
				THEN null
				ELSE {
					model: 'writingCredit',
					name: COALESCE(writingCreditName, 'by'),
					entities: entities
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
