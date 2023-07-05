export default () => `
	MATCH (material:Material)
		WHERE NOT EXISTS((material)-[:HAS_SUB_MATERIAL]->(:Material))

	OPTIONAL MATCH (material)-[entityRel:HAS_WRITING_ENTITY|USES_SOURCE_MATERIAL]->(entity:Person|Company|Material)

	OPTIONAL MATCH (entity:Material)-[sourceMaterialWriterRel:HAS_WRITING_ENTITY]->(sourceMaterialWriter:Person|Company)

	OPTIONAL MATCH (entity:Material)<-[:HAS_SUB_MATERIAL]-(entitySurMaterial:Material)

	OPTIONAL MATCH (entitySurMaterial)<-[:HAS_SUB_MATERIAL]-(entitySurSurMaterial:Material)

	WITH
		material,
		entityRel,
		entity,
		entitySurMaterial,
		entitySurSurMaterial,
		sourceMaterialWriterRel,
		sourceMaterialWriter
		ORDER BY sourceMaterialWriterRel.creditPosition, sourceMaterialWriterRel.entityPosition

	WITH
		material,
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

	WITH material, entityRel, entity, entitySurMaterial, entitySurSurMaterial,
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

	WITH material, entityRel.credit AS writingCreditName,
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

	WITH material, writingCreditName,
		[entity IN entities | CASE entity.model WHEN 'MATERIAL'
			THEN entity
			ELSE entity { .model, .uuid, .name }
		END] AS entities

	WITH material,
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

	OPTIONAL MATCH (material)<-[surMaterialRel:HAS_SUB_MATERIAL]-(surMaterial:Material)

	OPTIONAL MATCH (surMaterial)<-[surSurMaterialRel:HAS_SUB_MATERIAL]-(surSurMaterial:Material)

	RETURN
		'MATERIAL' AS model,
		material.uuid AS uuid,
		material.name AS name,
		material.format AS format,
		material.year AS year,
		CASE WHEN surMaterial IS NULL
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
		END AS surMaterial,
		writingCredits

	ORDER BY
		material.year DESC,
		COALESCE(surSurMaterial.name, surMaterial.name, material.name),
		surSurMaterialRel.position DESC,
		surMaterialRel.position DESC

	LIMIT 100
`;
