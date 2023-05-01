export default () => `
	MATCH (character:Character { uuid: $uuid })

	OPTIONAL MATCH (character)<-[materialRel:DEPICTS]-(material:Material)

	OPTIONAL MATCH (material)-[entityRel:HAS_WRITING_ENTITY|USES_SOURCE_MATERIAL]->(entity)
		WHERE entity:Person OR entity:Company OR entity:Material

	OPTIONAL MATCH (entity:Material)-[sourceMaterialWriterRel:HAS_WRITING_ENTITY]->(sourceMaterialWriter)
		WHERE sourceMaterialWriter:Person OR sourceMaterialWriter:Company

	OPTIONAL MATCH (entity:Material)<-[:HAS_SUB_MATERIAL]-(entitySurMaterial:Material)

	OPTIONAL MATCH (entitySurMaterial)<-[:HAS_SUB_MATERIAL]-(entitySurSurMaterial:Material)

	WITH
		character,
		materialRel,
		material,
		entityRel,
		entity,
		entitySurMaterial,
		entitySurSurMaterial,
		sourceMaterialWriterRel,
		sourceMaterialWriter
		ORDER BY sourceMaterialWriterRel.creditPosition, sourceMaterialWriterRel.entityPosition

	WITH
		character,
		materialRel,
		material,
		entityRel,
		entity,
		entitySurMaterial,
		entitySurSurMaterial,
		sourceMaterialWriterRel.credit AS sourceMaterialWritingCreditName,
		COLLECT(
			CASE sourceMaterialWriter WHEN NULL
				THEN null
				ELSE sourceMaterialWriter { model: TOUPPER(HEAD(LABELS(sourceMaterialWriter))), .uuid, .name }
			END
		) AS sourceMaterialWriters

	WITH character, materialRel, material, entityRel, entity, entitySurMaterial, entitySurSurMaterial,
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

	WITH character, materialRel, material, entityRel.credit AS writingCreditName,
		COLLECT(
			CASE entity WHEN NULL
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

	WITH character, materialRel, material, writingCreditName,
		[entity IN entities | CASE entity.model WHEN 'MATERIAL'
			THEN entity
			ELSE entity { .model, .uuid, .name }
		END] AS entities

	WITH character, materialRel, material,
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
		ORDER BY materialRel.groupPosition, materialRel.characterPosition

	WITH character, material, writingCredits,
		COLLECT(
			CASE WHEN ALL(x IN ['displayName', 'qualifier', 'group'] WHERE materialRel[x] IS NULL)
				THEN null
				ELSE materialRel { .displayName, .qualifier, .group }
			END
		) AS depictions

	OPTIONAL MATCH (material)<-[surMaterialRel:HAS_SUB_MATERIAL]-(surMaterial:Material)

	OPTIONAL MATCH (surMaterial)<-[surSurMaterialRel:HAS_SUB_MATERIAL]-(surSurMaterial:Material)

	WITH character, material, writingCredits, depictions, surMaterial, surSurMaterial
		ORDER BY
			material.year DESC,
			COALESCE(surSurMaterial.name, surMaterial.name, material.name),
			COALESCE(surSurMaterialRel.position, -1) DESC,
			COALESCE(surMaterialRel.position, -1) DESC

	WITH character,
		COLLECT(
			CASE material WHEN NULL
				THEN null
				ELSE material {
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
					depictions
				}
			END
		) AS materials

	OPTIONAL MATCH (character)<-[variantNamedDepiction:DEPICTS]-(:Material)
		WHERE variantNamedDepiction.displayName IS NOT NULL

	WITH character, materials, variantNamedDepiction
		ORDER BY variantNamedDepiction.displayName

	RETURN
		'CHARACTER' AS model,
		character.uuid AS uuid,
		character.name AS name,
		character.differentiator AS differentiator,
		materials,
		COLLECT(DISTINCT(variantNamedDepiction.displayName)) AS variantNamedDepictions
`;
