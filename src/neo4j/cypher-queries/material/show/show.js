export default () => `
	MATCH (material:Material { uuid: $uuid })

	OPTIONAL MATCH (material)-[:SUBSEQUENT_VERSION_OF]-(originalOrSubsequentVersionMaterial)

	OPTIONAL MATCH (material)<-[:USES_SOURCE_MATERIAL]-(sourcingMaterial:Material)

	OPTIONAL MATCH (material)-[:HAS_SUB_MATERIAL]-(subOrSurMaterial:Material)

	WITH
		material,
		[material] +
		COLLECT(originalOrSubsequentVersionMaterial) +
		COLLECT(sourcingMaterial) +
		COLLECT(subOrSurMaterial)
			AS relatedMaterials

	UNWIND (CASE relatedMaterials WHEN [] THEN [null] ELSE relatedMaterials END) AS relatedMaterial

		OPTIONAL MATCH (relatedMaterial)<-[originalVersionRel:SUBSEQUENT_VERSION_OF]-(material)

		OPTIONAL MATCH (relatedMaterial)-[subsequentVersionRel:SUBSEQUENT_VERSION_OF]->(material)

		OPTIONAL MATCH (relatedMaterial)-[sourcingMaterialRel:USES_SOURCE_MATERIAL]->(material)

		OPTIONAL MATCH (relatedMaterial)-[surMaterialRel:HAS_SUB_MATERIAL]->(material)

		OPTIONAL MATCH (relatedMaterial)<-[subMaterialRel:HAS_SUB_MATERIAL]-(material)

		OPTIONAL MATCH (relatedMaterial)-[entityRel:HAS_WRITING_ENTITY|USES_SOURCE_MATERIAL]->(entity)
			WHERE entity:Person OR entity:Company OR entity:Material

		OPTIONAL MATCH (entity)<-[originalVersionWritingEntityRel:HAS_WRITING_ENTITY|USES_SOURCE_MATERIAL]-(material)

		OPTIONAL MATCH (entity:Material)-[sourceMaterialWriterRel:HAS_WRITING_ENTITY]->(sourceMaterialWriter)
			WHERE sourceMaterialWriter:Person OR sourceMaterialWriter:Company

		OPTIONAL MATCH (entity:Material)<-[:HAS_SUB_MATERIAL]-(entitySurMaterial:Material)

		WITH
			material,
			relatedMaterial,
			CASE originalVersionRel WHEN NULL THEN false ELSE true END AS isOriginalVersion,
			CASE subsequentVersionRel WHEN NULL THEN false ELSE true END AS isSubsequentVersion,
			CASE sourcingMaterialRel WHEN NULL THEN false ELSE true END AS isSourcingMaterial,
			CASE surMaterialRel WHEN NULL THEN false ELSE true END AS isSurMaterial,
			CASE subMaterialRel WHEN NULL THEN false ELSE true END AS isSubMaterial,
			subMaterialRel.position AS subMaterialPosition,
			entityRel,
			entity,
			entitySurMaterial,
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
			isSurMaterial,
			isSubMaterial,
			subMaterialPosition,
			entityRel,
			entity,
			entitySurMaterial,
			isOriginalVersionWritingEntity,
			sourceMaterialWriterRel.credit AS sourceMaterialWritingCreditName,
			COLLECT(
				CASE sourceMaterialWriter WHEN NULL
					THEN null
					ELSE sourceMaterialWriter { model: TOUPPER(HEAD(LABELS(sourceMaterialWriter))), .uuid, .name }
				END
			) AS sourceMaterialWriters

		WITH
			material,
			relatedMaterial,
			isOriginalVersion,
			isSubsequentVersion,
			isSourcingMaterial,
			isSurMaterial,
			isSubMaterial,
			subMaterialPosition,
			entityRel,
			entity,
			entitySurMaterial,
			isOriginalVersionWritingEntity,
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
			relatedMaterial,
			isOriginalVersion,
			isSubsequentVersion,
			isSourcingMaterial,
			isSurMaterial,
			isSubMaterial,
			subMaterialPosition,
			entityRel.credit AS writingCreditName,
			COLLECT(
				CASE WHEN entity IS NULL OR (isSubsequentVersion AND isOriginalVersionWritingEntity)
					THEN null
					ELSE entity {
						model: TOUPPER(HEAD(LABELS(entity))),
						.uuid,
						.name,
						.format,
						.year,
						surMaterial: CASE entitySurMaterial WHEN NULL
							THEN null
							ELSE entitySurMaterial { model: 'MATERIAL', .uuid, .name }
						END,
						writingCredits: sourceMaterialWritingCredits
					}
				END
			) AS entities

		WITH
			material,
			relatedMaterial,
			isOriginalVersion,
			isSubsequentVersion,
			isSourcingMaterial,
			isSurMaterial,
			isSubMaterial,
			subMaterialPosition,
			writingCreditName,
			[entity IN entities | CASE entity.model WHEN 'MATERIAL'
				THEN entity
				ELSE entity { .model, .uuid, .name }
			END] AS entities

		WITH
			material,
			relatedMaterial,
			isOriginalVersion,
			isSubsequentVersion,
			isSourcingMaterial,
			isSurMaterial,
			isSubMaterial,
			subMaterialPosition,
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
			ORDER BY subMaterialPosition, relatedMaterial.year DESC, relatedMaterial.name

		OPTIONAL MATCH (relatedMaterial)<-[:HAS_SUB_MATERIAL]-(surMaterial:Material)

		WITH material,
			COLLECT(
				CASE relatedMaterial WHEN NULL
					THEN null
					ELSE relatedMaterial {
						model: 'MATERIAL',
						.uuid,
						.name,
						.format,
						.year,
						surMaterial: CASE surMaterial WHEN NULL
							THEN null
							ELSE surMaterial { model: 'MATERIAL', .uuid, .name }
						END,
						writingCredits,
						isOriginalVersion,
						isSubsequentVersion,
						isSourcingMaterial,
						isSurMaterial,
						isSubMaterial
					}
				END
			) AS relatedMaterials

	OPTIONAL MATCH (material)-[characterRel:DEPICTS]->(character:Character)

	WITH
		material,
		relatedMaterials,
		characterRel,
		character
		ORDER BY characterRel.groupPosition, characterRel.characterPosition

	WITH
		material,
		relatedMaterials,
		characterRel.group AS characterGroupName,
		characterRel.groupPosition AS characterGroupPosition,
		COLLECT(
			CASE character WHEN NULL
				THEN null
				ELSE character {
					model: 'CHARACTER',
					.uuid,
					name: COALESCE(characterRel.displayName, character.name),
					qualifier: characterRel.qualifier
				}
			END
		) AS characters

	WITH material, relatedMaterials,
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

	RETURN
		'MATERIAL' AS model,
		material.uuid AS uuid,
		material.name AS name,
		material.differentiator AS differentiator,
		material.format AS format,
		material.year AS year,
		HEAD([
			relatedMaterial IN relatedMaterials
				WHERE relatedMaterial.uuid = material.uuid | relatedMaterial.writingCredits
		]) AS writingCredits,
		HEAD([
			relatedMaterial IN relatedMaterials WHERE relatedMaterial.isOriginalVersion |
			relatedMaterial { .model, .uuid, .name, .format, .year, .surMaterial, .writingCredits }
		]) AS originalVersionMaterial,
		[
			relatedMaterial IN relatedMaterials WHERE relatedMaterial.isSubsequentVersion |
			relatedMaterial { .model, .uuid, .name, .format, .year, .surMaterial, .writingCredits }
		] AS subsequentVersionMaterials,
		[
			relatedMaterial IN relatedMaterials WHERE relatedMaterial.isSourcingMaterial |
			relatedMaterial { .model, .uuid, .name, .format, .year, .surMaterial, .writingCredits }
		] AS sourcingMaterials,
		HEAD([
			relatedMaterial IN relatedMaterials WHERE relatedMaterial.isSurMaterial |
			relatedMaterial { .model, .uuid, .name, .format, .year, .writingCredits }
		]) AS surMaterial,
		[
			relatedMaterial IN relatedMaterials WHERE relatedMaterial.isSubMaterial |
			relatedMaterial { .model, .uuid, .name, .format, .year, .writingCredits }
		] AS subMaterials,
		characterGroups
`;