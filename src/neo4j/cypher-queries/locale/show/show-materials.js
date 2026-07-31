export default () => `
	MATCH (locale:Locale { uuid: $uuid })

	CALL {
		WITH locale

		OPTIONAL MATCH (locale)<-[:HAS_SETTING]-(material:Material)

		WITH locale, COLLECT(DISTINCT(material)) AS materials

		UNWIND (CASE materials WHEN [] THEN [null] ELSE materials END) AS material

			OPTIONAL MATCH (material)-[localeSettingRel:HAS_SETTING]->(locale)

			OPTIONAL MATCH (time:Time { uuid: localeSettingRel.timeUuid })

			OPTIONAL MATCH (place:Place { uuid: localeSettingRel.placeUuid })

			WITH material, locale, localeSettingRel, time, place
				ORDER BY localeSettingRel.position

			WITH
				material,
				COLLECT(
					CASE WHEN localeSettingRel IS NULL
						THEN null
						ELSE {
							model: 'SETTING',
							time: CASE WHEN time IS NULL
								THEN null
								ELSE time { model: 'TIME', .uuid, .name }
							END,
							place: CASE WHEN place IS NULL
								THEN null
								ELSE place { model: 'PLACE', .uuid, .name }
							END,
							locale: locale { model: 'LOCALE', .uuid, .name }
						}
					END
				) AS settings

			OPTIONAL MATCH (material)-[entityRel:HAS_WRITING_ENTITY|USES_SOURCE_MATERIAL]->(entity:Person|Company|Material)

			OPTIONAL MATCH (entity:Material)-[sourceMaterialWriterRel:HAS_WRITING_ENTITY]->
				(sourceMaterialWriter:Person|Company)

			OPTIONAL MATCH (entity:Material)<-[:HAS_SUB_MATERIAL]-(entitySurMaterial:Material)

			OPTIONAL MATCH (entitySurMaterial)<-[:HAS_SUB_MATERIAL]-(entitySurSurMaterial:Material)

			WITH
				material,
				settings,
				entityRel,
				entity,
				entitySurMaterial,
				entitySurSurMaterial,
				sourceMaterialWriterRel,
				sourceMaterialWriter
				ORDER BY sourceMaterialWriterRel.creditPosition, sourceMaterialWriterRel.entityPosition

			WITH
				material,
				settings,
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

			WITH material, settings, entityRel, entity, entitySurMaterial, entitySurSurMaterial,
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

			WITH material, settings, entityRel.credit AS writingCreditName,
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

			WITH material, settings, writingCreditName,
				[entity IN entities | CASE entity.model WHEN 'MATERIAL'
					THEN entity
					ELSE entity { .model, .uuid, .name }
				END] AS entities

			WITH material, settings,
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

			WITH material, settings, writingCredits, surMaterial, surSurMaterial
				ORDER BY
					material.year DESC,
					COALESCE(surSurMaterial.name, surMaterial.name, material.name),
					COALESCE(surSurMaterialRel.position, surMaterialRel.position, -1) DESC,
					COALESCE(surSurMaterialRel.position, -1) DESC,
					COALESCE(surMaterialRel.position, -1) DESC

		RETURN
			COLLECT(
				CASE WHEN material IS NULL
					THEN null
					ELSE material {
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
						settings
					}
				END
			) AS materials
	}

	RETURN
		materials
`;
