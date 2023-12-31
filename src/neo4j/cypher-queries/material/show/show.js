export default () => `
	MATCH (material:Material { uuid: $uuid })

	OPTIONAL MATCH (material)<-[:HAS_SUB_MATERIAL*1..2]-(surMaterial:Material)

	WITH
		material,
		COLLECT(surMaterial) AS surMaterials

	OPTIONAL MATCH (material)-[:HAS_SUB_MATERIAL*1..2]->(subMaterial:Material)

	WITH
		material,
		surMaterials,
		COLLECT(subMaterial) AS subMaterials

	WITH
		material,
		[material] + surMaterials + subMaterials AS collectionMaterials

	UNWIND (CASE collectionMaterials WHEN [] THEN [null] ELSE collectionMaterials END) AS collectionMaterial

		OPTIONAL MATCH (collectionMaterial)-[:SUBSEQUENT_VERSION_OF]->(originalVersionMaterial)

		WITH
			material,
			collectionMaterial,
			[collectionMaterial, originalVersionMaterial] AS relatedMaterials

		UNWIND (CASE relatedMaterials WHEN [] THEN [null] ELSE relatedMaterials END) AS relatedMaterial

			OPTIONAL MATCH (relatedMaterial)<-[originalVersionRel:SUBSEQUENT_VERSION_OF]-(collectionMaterial)

			OPTIONAL MATCH (relatedMaterial)-[entityRel:HAS_WRITING_ENTITY|USES_SOURCE_MATERIAL]->
				(entity:Person|Company|Material)

			OPTIONAL MATCH (entity:Material)-[sourceMaterialWriterRel:HAS_WRITING_ENTITY]->
				(sourceMaterialWriter:Person|Company)

			OPTIONAL MATCH (entity:Material)<-[:HAS_SUB_MATERIAL]-(entitySurMaterial:Material)

			OPTIONAL MATCH (entitySurMaterial)<-[:HAS_SUB_MATERIAL]-(entitySurSurMaterial:Material)

			WITH
				material,
				collectionMaterial,
				relatedMaterial,
				CASE WHEN originalVersionRel IS NULL THEN false ELSE true END AS isOriginalVersion,
				entityRel,
				entity,
				entitySurMaterial,
				entitySurSurMaterial,
				sourceMaterialWriterRel,
				sourceMaterialWriter
				ORDER BY sourceMaterialWriterRel.creditPosition, sourceMaterialWriterRel.entityPosition

			WITH
				material,
				collectionMaterial,
				relatedMaterial,
				isOriginalVersion,
				entityRel,
				entity,
				entitySurMaterial,
				entitySurSurMaterial,
				sourceMaterialWriterRel.credit AS sourceMaterialWritingCreditName,
				COLLECT(
					CASE WHEN sourceMaterialWriter IS NULL
						THEN null
						ELSE sourceMaterialWriter { model: TOUPPER(HEAD(LABELS(sourceMaterialWriter))), .uuid, .name }
					END
				) AS sourceMaterialWriters

			WITH
				material,
				collectionMaterial,
				relatedMaterial,
				isOriginalVersion,
				entityRel,
				entity,
				entitySurMaterial,
				entitySurSurMaterial,
				COLLECT(
					CASE SIZE(sourceMaterialWriters) WHEN 0
						THEN null
						ELSE {
							model: 'WRITING_CREDIT',
							name: COALESCE(sourceMaterialWritingCreditName, 'by'),
							entities: sourceMaterialWriters
						}
					END
				) AS sourceMaterialWritingCredits
				ORDER BY entityRel.creditPosition, entityRel.entityPosition

			WITH
				material,
				collectionMaterial,
				relatedMaterial,
				isOriginalVersion,
				entityRel.credit AS writingCreditName,
				COLLECT(
					CASE WHEN entity IS NULL
						THEN null
						ELSE entity {
							model: TOUPPER(HEAD(LABELS(entity))),
							.uuid,
							.name,
							.format,
							.year,
							surMaterial: CASE WHEN entitySurMaterial IS NULL
								THEN null
								ELSE entitySurMaterial {
									model: 'MATERIAL',
									.uuid,
									.name,
									surMaterial: CASE WHEN entitySurSurMaterial IS NULL
										THEN null
										ELSE entitySurSurMaterial { model: 'MATERIAL', .uuid, .name }
									END
								}
							END,
							writingCredits: sourceMaterialWritingCredits
						}
					END
				) AS entities

			WITH
				material,
				collectionMaterial,
				relatedMaterial,
				isOriginalVersion,
				writingCreditName,
				[entity IN entities | CASE entity.model WHEN 'MATERIAL'
					THEN entity
					ELSE entity { .model, .uuid, .name }
				END] AS entities

			WITH
				material,
				collectionMaterial,
				relatedMaterial,
				isOriginalVersion,
				COLLECT(
					CASE SIZE(entities) WHEN 0
						THEN null
						ELSE {
							model: 'WRITING_CREDIT',
							name: COALESCE(writingCreditName, 'by'),
							entities: entities
						}
					END
				) AS writingCredits
				ORDER BY relatedMaterial.year DESC, relatedMaterial.name

			OPTIONAL MATCH (relatedMaterial)<-[:HAS_SUB_MATERIAL]-(surMaterial:Material)

			OPTIONAL MATCH (surMaterial)<-[:HAS_SUB_MATERIAL]-(surSurMaterial:Material)

			WITH
				material,
				collectionMaterial,
				COLLECT(
					CASE WHEN relatedMaterial IS NULL
						THEN null
						ELSE relatedMaterial {
							model: 'MATERIAL',
							.uuid,
							.name,
							.format,
							.year,
							surMaterial: CASE WHEN surMaterial IS NULL
								THEN null
								ELSE surMaterial {
									model: 'MATERIAL',
									.uuid,
									.name,
									surMaterial: CASE WHEN surSurMaterial IS NULL
										THEN null
										ELSE surSurMaterial { model: 'MATERIAL', .uuid, .name }
									END
								}
							END,
							writingCredits,
							isOriginalVersion
						}
					END
				) AS relatedMaterials

		WITH
			material,
			collectionMaterial,
			HEAD([
				relatedMaterial IN relatedMaterials
					WHERE relatedMaterial.uuid = collectionMaterial.uuid | relatedMaterial.writingCredits
			]) AS writingCredits,
			HEAD([
				relatedMaterial IN relatedMaterials WHERE relatedMaterial.isOriginalVersion |
				relatedMaterial { .model, .uuid, .name, .format, .year, .surMaterial, .writingCredits }
			]) AS originalVersionMaterial

		OPTIONAL MATCH (collectionMaterial)-[characterRel:DEPICTS]->(character:Character)

		WITH
			material,
			collectionMaterial,
			writingCredits,
			originalVersionMaterial,
			characterRel,
			character
			ORDER BY characterRel.groupPosition, characterRel.characterPosition

		WITH
			material,
			collectionMaterial,
			writingCredits,
			originalVersionMaterial,
			characterRel.group AS characterGroupName,
			characterRel.groupPosition AS characterGroupPosition,
			COLLECT(
				CASE WHEN character IS NULL
					THEN null
					ELSE character {
						model: 'CHARACTER',
						.uuid,
						name: COALESCE(characterRel.displayName, character.name),
						qualifier: characterRel.qualifier
					}
				END
			) AS characters

		WITH
			material,
			collectionMaterial,
			writingCredits,
			originalVersionMaterial,
			COLLECT(
				CASE SIZE(characters) WHEN 0
					THEN null
					ELSE {
						model: 'CHARACTER_GROUP',
						name: characterGroupName,
						position: characterGroupPosition,
						characters: characters
					}
				END
			) AS characterGroups

		OPTIONAL MATCH (collectionMaterial)-[surMaterialRel:HAS_SUB_MATERIAL]->(material)

		OPTIONAL MATCH (collectionMaterial)-[surSurMaterialRel:HAS_SUB_MATERIAL]->
			(:Material)-[:HAS_SUB_MATERIAL]->(material)

		OPTIONAL MATCH (collectionMaterial)<-[subMaterialRel:HAS_SUB_MATERIAL]-(material)

		OPTIONAL MATCH (collectionMaterial)<-[subSubMaterialRel:HAS_SUB_MATERIAL]-
			(subSubMaterialSurMaterial:Material)<-[:HAS_SUB_MATERIAL]-(material)

		WITH
			material,
			collectionMaterial,
			CASE WHEN material = collectionMaterial THEN true ELSE false END AS isSubjectMaterial,
			CASE WHEN surMaterialRel IS NULL THEN false ELSE true END AS isSurMaterial,
			CASE WHEN surSurMaterialRel IS NULL THEN false ELSE true END AS isSurSurMaterial,
			CASE WHEN subMaterialRel IS NULL THEN false ELSE true END AS isSubMaterial,
			CASE WHEN subSubMaterialRel IS NULL THEN false ELSE true END AS isSubSubMaterial,
			subSubMaterialSurMaterial.uuid AS subSubMaterialSurMaterialUuid,
			writingCredits,
			originalVersionMaterial,
			characterGroups
			ORDER BY subMaterialRel.position, subSubMaterialRel.position

		WITH material,
			COLLECT(
				collectionMaterial {
					model: 'MATERIAL',
					.uuid,
					.name,
					.differentiator,
					.format,
					.year,
					isSubjectMaterial,
					isSurMaterial,
					isSurSurMaterial,
					isSubMaterial,
					isSubSubMaterial,
					subSubMaterialSurMaterialUuid,
					writingCredits,
					originalVersionMaterial,
					characterGroups
				}
			) AS collectionMaterials

		WITH material,
			HEAD([
				collectionMaterial IN collectionMaterials WHERE collectionMaterial.isSubjectMaterial |
				collectionMaterial {
					.writingCredits,
					.originalVersionMaterial,
					.characterGroups
				}
			]) AS subjectMaterial,
			HEAD([
				collectionMaterial IN collectionMaterials WHERE collectionMaterial.isSurMaterial |
				collectionMaterial {
					.model,
					.uuid,
					.name,
					.format,
					.year,
					.writingCredits,
					.originalVersionMaterial,
					surMaterial: HEAD([
						surSurMaterial IN collectionMaterials WHERE surSurMaterial.isSurSurMaterial |
							surSurMaterial {
								.model,
								.uuid,
								.name,
								.format,
								.year,
								.writingCredits,
								.originalVersionMaterial,
								.characterGroups
							}
					]),
					.characterGroups
				}
			]) AS surMaterial,
			[
				collectionMaterial IN collectionMaterials WHERE collectionMaterial.isSubMaterial |
				collectionMaterial {
					.model,
					.uuid,
					.name,
					.format,
					.year,
					.writingCredits,
					.originalVersionMaterial,
					subMaterials: [
						subSubMaterial IN collectionMaterials
							WHERE
								subSubMaterial.isSubSubMaterial AND
								subSubMaterial.subSubMaterialSurMaterialUuid = collectionMaterial.uuid |
							subSubMaterial {
								.model,
								.uuid,
								.name,
								.format,
								.year,
								.writingCredits,
								.originalVersionMaterial,
								.characterGroups
							}
					],
					.characterGroups
				}
			] AS subMaterials

	RETURN
		'MATERIAL' AS model,
		material.uuid AS uuid,
		material.name AS name,
		material.differentiator AS differentiator,
		material.format AS format,
		material.year AS year,
		subjectMaterial.writingCredits AS writingCredits,
		subjectMaterial.originalVersionMaterial AS originalVersionMaterial,
		surMaterial,
		subMaterials,
		subjectMaterial.characterGroups AS characterGroups
`;
