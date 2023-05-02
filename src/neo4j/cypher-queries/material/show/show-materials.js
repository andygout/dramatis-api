export default () => `
	MATCH (material:Material { uuid: $uuid })

	OPTIONAL MATCH (material)<-[:SUBSEQUENT_VERSION_OF]-(subsequentVersionMaterial)

	WITH
		material,
		COLLECT(subsequentVersionMaterial) AS subsequentVersionMaterials

	OPTIONAL MATCH (material)<-[:USES_SOURCE_MATERIAL]-(sourcingMaterial:Material)

	WITH
		material,
		[material] +
		subsequentVersionMaterials +
		COLLECT(sourcingMaterial)
			AS relatedMaterials

	UNWIND (CASE relatedMaterials WHEN [] THEN [null] ELSE relatedMaterials END) AS relatedMaterial

		OPTIONAL MATCH (relatedMaterial)-[subsequentVersionRel:SUBSEQUENT_VERSION_OF]->(material)

		OPTIONAL MATCH (relatedMaterial)-[sourcingMaterialRel:USES_SOURCE_MATERIAL]->(material)

		OPTIONAL MATCH (relatedMaterial)-[entityRel:HAS_WRITING_ENTITY|USES_SOURCE_MATERIAL]->(entity)
			WHERE entity:Person OR entity:Company OR entity:Material

		OPTIONAL MATCH (entity)<-[originalVersionWritingEntityRel:HAS_WRITING_ENTITY|USES_SOURCE_MATERIAL]-(material)

		OPTIONAL MATCH (entity:Material)-[sourceMaterialWriterRel:HAS_WRITING_ENTITY]->(sourceMaterialWriter)
			WHERE sourceMaterialWriter:Person OR sourceMaterialWriter:Company

		OPTIONAL MATCH (entity:Material)<-[:HAS_SUB_MATERIAL]-(entitySurMaterial:Material)

		OPTIONAL MATCH (entitySurMaterial)<-[:HAS_SUB_MATERIAL]-(entitySurSurMaterial:Material)

		WITH
			material,
			relatedMaterial,
			CASE subsequentVersionRel WHEN NULL THEN false ELSE true END AS isSubsequentVersion,
			CASE sourcingMaterialRel WHEN NULL THEN false ELSE true END AS isSourcingMaterial,
			entityRel,
			entity,
			entitySurMaterial,
			entitySurSurMaterial,
			CASE originalVersionWritingEntityRel WHEN NULL THEN false ELSE true END AS isOriginalVersionWritingEntity,
			sourceMaterialWriterRel,
			sourceMaterialWriter
			ORDER BY sourceMaterialWriterRel.creditPosition, sourceMaterialWriterRel.entityPosition

		WITH
			material,
			relatedMaterial,
			isSubsequentVersion,
			isSourcingMaterial,
			entityRel,
			entity,
			entitySurMaterial,
			entitySurSurMaterial,
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
			isSubsequentVersion,
			isSourcingMaterial,
			entityRel,
			entity,
			entitySurMaterial,
			entitySurSurMaterial,
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
			isSubsequentVersion,
			isSourcingMaterial,
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
							ELSE entitySurMaterial {
								model: 'MATERIAL',
								.uuid,
								.name,
								surMaterial: CASE entitySurSurMaterial WHEN NULL
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
			relatedMaterial,
			isSubsequentVersion,
			isSourcingMaterial,
			writingCreditName,
			[entity IN entities | CASE entity.model WHEN 'MATERIAL'
				THEN entity
				ELSE entity { .model, .uuid, .name }
			END] AS entities

		WITH
			material,
			relatedMaterial,
			isSubsequentVersion,
			isSourcingMaterial,
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
							ELSE surMaterial {
								model: 'MATERIAL',
								.uuid,
								.name,
								surMaterial: CASE surSurMaterial WHEN NULL
									THEN null
									ELSE surSurMaterial { model: 'MATERIAL', .uuid, .name }
								END
							}
						END,
						writingCredits,
						isSubsequentVersion,
						isSourcingMaterial
					}
				END
			) AS relatedMaterials

	RETURN
		[
			relatedMaterial IN relatedMaterials WHERE relatedMaterial.isSubsequentVersion |
			relatedMaterial { .model, .uuid, .name, .format, .year, .surMaterial, .writingCredits }
		] AS subsequentVersionMaterials,
		[
			relatedMaterial IN relatedMaterials WHERE relatedMaterial.isSourcingMaterial |
			relatedMaterial { .model, .uuid, .name, .format, .year, .surMaterial, .writingCredits }
		] AS sourcingMaterials
`;
