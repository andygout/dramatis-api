export default () => `
	MATCH (material:Material { uuid: $uuid })

	CALL {
		WITH material

		OPTIONAL MATCH (material)<-[:SUBSEQUENT_VERSION_OF]-(subsequentVersionMaterial)
			WHERE NOT EXISTS(
				(material)<-[:SUBSEQUENT_VERSION_OF]-(:Material)<-[:HAS_SUB_MATERIAL*1..2]-(subsequentVersionMaterial)
			)

		OPTIONAL MATCH (material)<-[:USES_SOURCE_MATERIAL]-(sourcingMaterial:Material)
			WHERE NOT EXISTS(
				(material)<-[:USES_SOURCE_MATERIAL]-(:Material)<-[:HAS_SUB_MATERIAL*1..2]-(sourcingMaterial)
			)

		WITH
			material,
			COLLECT(subsequentVersionMaterial) AS subsequentVersionMaterials,
			COLLECT(sourcingMaterial) AS sourcingMaterials

		WITH
			material,
			[material] + subsequentVersionMaterials + sourcingMaterials AS relatedMaterials

		UNWIND (CASE relatedMaterials WHEN [] THEN [null] ELSE relatedMaterials END) AS relatedMaterial

			OPTIONAL MATCH (relatedMaterial)-[subsequentVersionRel:SUBSEQUENT_VERSION_OF]->(material)

			OPTIONAL MATCH (relatedMaterial)-[sourcingMaterialRel:USES_SOURCE_MATERIAL]->(material)

			OPTIONAL MATCH (relatedMaterial)-[entityRel:HAS_WRITING_ENTITY|USES_SOURCE_MATERIAL]->
				(entity:Person|Company|Material)

			OPTIONAL MATCH (entity)<-[originalVersionWritingEntityRel:HAS_WRITING_ENTITY|USES_SOURCE_MATERIAL]-(material)

			OPTIONAL MATCH (entity:Material)-[sourceMaterialWriterRel:HAS_WRITING_ENTITY]->
				(sourceMaterialWriter:Person|Company)

			OPTIONAL MATCH (entity:Material)<-[:HAS_SUB_MATERIAL]-(entitySurMaterial:Material)

			OPTIONAL MATCH (entitySurMaterial)<-[:HAS_SUB_MATERIAL]-(entitySurSurMaterial:Material)

			WITH
				material,
				relatedMaterial,
				CASE WHEN subsequentVersionRel IS NULL THEN false ELSE true END AS isSubsequentVersion,
				CASE WHEN sourcingMaterialRel IS NULL THEN false ELSE true END AS isSourcingMaterial,
				entityRel,
				entity,
				entitySurMaterial,
				entitySurSurMaterial,
				CASE WHEN originalVersionWritingEntityRel IS NULL THEN false ELSE true END AS isOriginalVersionWritingEntity,
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
					CASE WHEN sourceMaterialWriter IS NULL
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
	}

	RETURN
		subsequentVersionMaterials,
		sourcingMaterials
`;
