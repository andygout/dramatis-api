export default () => `
	MATCH (person:Person { uuid: $uuid })

	OPTIONAL MATCH (person)<-[:HAS_WRITING_ENTITY]-(:Material)<-[:USES_SOURCE_MATERIAL*0..1]-(material:Material)
		WHERE NOT EXISTS(
			(person)<-[:HAS_WRITING_ENTITY]-(:Material)<-[:USES_SOURCE_MATERIAL*0..1]-(:Material)
			<-[:HAS_SUB_MATERIAL]-(material)
		)

	WITH person, COLLECT(DISTINCT(material)) AS materials

	UNWIND (CASE materials WHEN [] THEN [null] ELSE materials END) AS material

		OPTIONAL MATCH (person)<-[writerRel:HAS_WRITING_ENTITY]-(material)

		OPTIONAL MATCH (person)<-[:HAS_WRITING_ENTITY]-(:Material)
			<-[subsequentVersionRel:SUBSEQUENT_VERSION_OF]-(material)

		OPTIONAL MATCH (person)<-[:HAS_WRITING_ENTITY]-(:Material)
			<-[sourcingMaterialRel:USES_SOURCE_MATERIAL]-(material)

		OPTIONAL MATCH (material)-[entityRel:HAS_WRITING_ENTITY|USES_SOURCE_MATERIAL]->(entity)
			WHERE entity:Person OR entity:Company OR entity:Material

		OPTIONAL MATCH (entity:Material)<-[:HAS_SUB_MATERIAL]-(entitySurMaterial:Material)

		OPTIONAL MATCH (entity:Material)-[sourceMaterialWriterRel:HAS_WRITING_ENTITY]->(sourceMaterialWriter)
			WHERE sourceMaterialWriter:Person OR sourceMaterialWriter:Company

		WITH
			person,
			material,
			writerRel.creditType AS creditType,
			CASE writerRel WHEN NULL THEN false ELSE true END AS hasDirectCredit,
			CASE subsequentVersionRel WHEN NULL THEN false ELSE true END AS isSubsequentVersion,
			CASE sourcingMaterialRel WHEN NULL THEN false ELSE true END AS isSourcingMaterial,
			entityRel,
			entity,
			entitySurMaterial,
			sourceMaterialWriterRel,
			sourceMaterialWriter
			ORDER BY sourceMaterialWriterRel.creditPosition, sourceMaterialWriterRel.entityPosition

		WITH
			person,
			material,
			creditType,
			hasDirectCredit,
			isSubsequentVersion,
			isSourcingMaterial,
			entityRel,
			entity,
			entitySurMaterial,
			sourceMaterialWriterRel.credit AS sourceMaterialWritingCreditName,
			COLLECT(
				CASE sourceMaterialWriter WHEN NULL
					THEN null
					ELSE sourceMaterialWriter { model: TOUPPER(HEAD(LABELS(sourceMaterialWriter))), .uuid, .name }
				END
			) AS sourceMaterialWriters

		WITH
			person,
			material,
			creditType,
			hasDirectCredit,
			isSubsequentVersion,
			isSourcingMaterial,
			entityRel,
			entity,
			entitySurMaterial,
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
			person,
			material,
			creditType,
			hasDirectCredit,
			isSubsequentVersion,
			isSourcingMaterial,
			entityRel.credit AS writingCreditName,
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
							ELSE entitySurMaterial { model: 'MATERIAL', .uuid, .name }
						END,
						writingCredits: sourceMaterialWritingCredits
					}
				END
			) AS entities

		WITH
			person,
			material,
			creditType,
			hasDirectCredit,
			isSubsequentVersion,
			isSourcingMaterial,
			writingCreditName,
			[entity IN entities | CASE entity.model WHEN 'MATERIAL'
				THEN entity
				ELSE entity { .model, .uuid, .name }
			END] AS entities

		WITH person, material, creditType, hasDirectCredit, isSubsequentVersion, isSourcingMaterial,
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
			ORDER BY material.year DESC, material.name

		OPTIONAL MATCH (material)<-[:HAS_SUB_MATERIAL]-(surMaterial:Material)

		WITH person,
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
							ELSE surMaterial { model: 'MATERIAL', .uuid, .name }
						END,
						writingCredits,
						creditType,
						hasDirectCredit,
						isSubsequentVersion,
						isSourcingMaterial
					}
				END
			) AS materials

	RETURN
		'PERSON' AS model,
		person.uuid AS uuid,
		person.name AS name,
		person.differentiator AS differentiator,
		[
			material IN materials WHERE
				material.hasDirectCredit AND
				NOT material.isSubsequentVersion AND
				material.creditType IS NULL |
			material { .model, .uuid, .name, .format, .year, .writingCredits, .surMaterial }
		] AS materials,
		[
			material IN materials WHERE material.isSubsequentVersion |
			material { .model, .uuid, .name, .format, .year, .writingCredits, .surMaterial }
		] AS subsequentVersionMaterials,
		[
			material IN materials WHERE
				material.isSourcingMaterial OR
				material.creditType = 'NON_SPECIFIC_SOURCE_MATERIAL' |
			material { .model, .uuid, .name, .format, .year, .writingCredits, .surMaterial }
		] AS sourcingMaterials,
		[
			material IN materials WHERE material.creditType = 'RIGHTS_GRANTOR' |
			material { .model, .uuid, .name, .format, .year, .writingCredits, .surMaterial }
		] AS rightsGrantorMaterials
`;
